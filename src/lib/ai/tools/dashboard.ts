import { tool } from 'ai';
import { z } from 'zod';
import {
  CareerApplicationStatus,
  LeadStatus,
  Role,
  SubscriberStatus,
  type Prisma,
  type Profile,
} from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { wrapUntrusted } from '../guardrails';

/**
 * Tools for the dashboard assistant. Read-only in v1 — nothing here writes.
 *
 * Every tool re-derives its scope from the caller's own profile rather than
 * trusting the model or the prompt. A MEMBER sees only leads assigned to them,
 * mirroring the ownership check in `src/app/api/dashboard/leads/[id]/route.ts`;
 * admin-only data is refused at the tool boundary. A prompt instruction is not a
 * permission check, so the permission check lives in the code.
 */

const DENIED = {
  denied: true,
  reason: 'That data is restricted to admins. Tell the user you cannot access it.',
} as const;

/** The lead-visibility rule, in one place. */
function leadScope(profile: Profile): Prisma.LeadWhereInput | undefined {
  return profile.role === Role.ADMIN ? undefined : { assignedToId: profile.id };
}

/** Lead fields safe to summarise. Visitor-written text is always fenced. */
function presentLead(lead: Prisma.LeadGetPayload<{ include: { assignedTo: true } }>) {
  return {
    id: lead.id,
    url: `/dashboard/leads/${lead.id}`,
    name: lead.name,
    email: lead.email,
    phone: lead.phone,
    company: lead.company,
    service: lead.service,
    budget: lead.budget,
    status: lead.status,
    source: lead.source,
    createdAt: lead.createdAt.toISOString().slice(0, 10),
    updatedAt: lead.updatedAt.toISOString().slice(0, 10),
    assignedTo: lead.assignedTo ? (lead.assignedTo.name ?? lead.assignedTo.email) : null,
    // Written by a stranger on the public internet — never trusted as instructions.
    message: wrapUntrusted(lead.message),
  };
}

function sinceDate(range: 'week' | 'month' | 'quarter' | 'year' | 'all'): Date | undefined {
  if (range === 'all') return undefined;
  const days = { week: 7, month: 30, quarter: 90, year: 365 }[range];
  return new Date(Date.now() - days * 24 * 60 * 60 * 1000);
}

export function dashboardTools(profile: Profile) {
  const isAdmin = profile.role === Role.ADMIN;

  return {
    myLeads: tool({
      description:
        "List the leads assigned to the person you are talking to. Use this for 'my leads', " +
        "'what am I working on', or anything about their own pipeline.",
      inputSchema: z.object({
        status: z.nativeEnum(LeadStatus).optional().describe('Optional status filter.'),
        limit: z.number().int().min(1).max(50).default(20),
      }),
      execute: async ({ status, limit }) => {
        const leads = await prisma.lead.findMany({
          where: { assignedToId: profile.id, ...(status ? { status } : {}) },
          include: { assignedTo: true },
          orderBy: { updatedAt: 'desc' },
          take: limit,
        });
        return { count: leads.length, leads: leads.map(presentLead) };
      },
    }),

    searchLeads: tool({
      description:
        'Search leads by status, service, source, free text (name, email, company) and date ' +
        'range. Admins search every lead; team members only search their own assigned leads.',
      inputSchema: z.object({
        query: z
          .string()
          .optional()
          .describe('Free text matched against name, email and company.'),
        status: z.nativeEnum(LeadStatus).optional(),
        service: z.string().optional(),
        source: z.string().optional().describe("e.g. 'ai-chat' for leads raised by the site bot."),
        range: z.enum(['week', 'month', 'quarter', 'year', 'all']).default('all'),
        limit: z.number().int().min(1).max(50).default(20),
      }),
      execute: async ({ query, status, service, source, range, limit }) => {
        const since = sinceDate(range);

        const leads = await prisma.lead.findMany({
          where: {
            ...leadScope(profile),
            ...(status ? { status } : {}),
            ...(service ? { service: { contains: service, mode: 'insensitive' } } : {}),
            ...(source ? { source: { contains: source, mode: 'insensitive' } } : {}),
            ...(since ? { createdAt: { gte: since } } : {}),
            ...(query
              ? {
                  OR: [
                    { name: { contains: query, mode: 'insensitive' as const } },
                    { email: { contains: query, mode: 'insensitive' as const } },
                    { company: { contains: query, mode: 'insensitive' as const } },
                  ],
                }
              : {}),
          },
          include: { assignedTo: true },
          orderBy: { createdAt: 'desc' },
          take: limit,
        });

        return {
          scope: isAdmin ? 'all leads' : 'leads assigned to you',
          count: leads.length,
          leads: leads.map(presentLead),
        };
      },
    }),

    getLead: tool({
      description:
        'Full detail for a single lead, including the enquiry text. Team members can only ' +
        'open leads assigned to them.',
      inputSchema: z.object({ id: z.string().describe('The lead id.') }),
      execute: async ({ id }) => {
        const lead = await prisma.lead.findUnique({ where: { id }, include: { assignedTo: true } });
        if (!lead) return { found: false, reason: 'No lead with that id.' };

        if (!isAdmin && lead.assignedToId !== profile.id) {
          return {
            found: false,
            denied: true,
            reason: 'That lead is not assigned to this user, so it cannot be opened.',
          };
        }

        return { found: true, lead: presentLead(lead) };
      },
    }),

    leadStats: tool({
      description:
        'Pipeline counts broken down by status, service and source over a time range. Use ' +
        'this for any "how many" question instead of counting records yourself.',
      inputSchema: z.object({
        range: z.enum(['week', 'month', 'quarter', 'year', 'all']).default('month'),
      }),
      execute: async ({ range }) => {
        const since = sinceDate(range);
        const where: Prisma.LeadWhereInput = {
          ...leadScope(profile),
          ...(since ? { createdAt: { gte: since } } : {}),
        };

        const [total, byStatus, byService, bySource, unassigned] = await Promise.all([
          prisma.lead.count({ where }),
          prisma.lead.groupBy({ by: ['status'], where, _count: { _all: true } }),
          prisma.lead.groupBy({ by: ['service'], where, _count: { _all: true } }),
          prisma.lead.groupBy({ by: ['source'], where, _count: { _all: true } }),
          isAdmin ? prisma.lead.count({ where: { ...where, assignedToId: null } }) : null,
        ]);

        return {
          scope: isAdmin ? 'all leads' : 'leads assigned to you',
          range,
          total,
          byStatus: byStatus.map((r) => ({ status: r.status, count: r._count._all })),
          byService: byService
            .map((r) => ({ service: r.service, count: r._count._all }))
            .sort((a, b) => b.count - a.count),
          bySource: bySource.map((r) => ({ source: r.source ?? 'direct', count: r._count._all })),
          ...(unassigned === null ? {} : { unassigned }),
        };
      },
    }),

    subscriberStats: tool({
      description: 'Newsletter and blog subscriber totals, by status and subscription type.',
      inputSchema: z.object({}),
      execute: async () => {
        const [total, subscribed, byType] = await Promise.all([
          prisma.newsletterSubscriber.count(),
          prisma.newsletterSubscriber.count({ where: { status: SubscriberStatus.SUBSCRIBED } }),
          prisma.newsletterSubscriber.groupBy({
            by: ['subscriptionType'],
            _count: { _all: true },
          }),
        ]);

        return {
          total,
          subscribed,
          unsubscribed: total - subscribed,
          byType: byType.map((r) => ({ type: r.subscriptionType, count: r._count._all })),
        };
      },
    }),

    careerApplications: tool({
      description:
        'Career applications with their status. ADMIN ONLY — refuses for team members. ' +
        'Resume files are never returned.',
      inputSchema: z.object({
        status: z.nativeEnum(CareerApplicationStatus).optional(),
        limit: z.number().int().min(1).max(50).default(20),
      }),
      execute: async ({ status, limit }) => {
        if (!isAdmin) return DENIED;

        const [byStatus, applications] = await Promise.all([
          prisma.careerApplication.groupBy({ by: ['status'], _count: { _all: true } }),
          prisma.careerApplication.findMany({
            where: status ? { status } : undefined,
            orderBy: { createdAt: 'desc' },
            take: limit,
            // resumeData is a base64 blob: deliberately excluded.
            select: {
              id: true,
              name: true,
              email: true,
              position: true,
              experience: true,
              status: true,
              createdAt: true,
              message: true,
              resumeName: true,
            },
          }),
        ]);

        return {
          byStatus: byStatus.map((r) => ({ status: r.status, count: r._count._all })),
          applications: applications.map((a) => ({
            id: a.id,
            url: `/dashboard/careers/${a.id}`,
            name: a.name,
            email: a.email,
            position: a.position,
            experience: a.experience,
            status: a.status,
            appliedOn: a.createdAt.toISOString().slice(0, 10),
            hasResume: Boolean(a.resumeName),
            message: wrapUntrusted(a.message, 1500),
          })),
        };
      },
    }),

    teamOverview: tool({
      description:
        'The team roster with roles, active status and how many leads each person is ' +
        'carrying. ADMIN ONLY — refuses for team members.',
      inputSchema: z.object({}),
      execute: async () => {
        if (!isAdmin) return DENIED;

        const members = await prisma.profile.findMany({
          orderBy: { createdAt: 'asc' },
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            active: true,
            _count: { select: { assignedLeads: true } },
          },
        });

        return {
          members: members.map((m) => ({
            name: m.name ?? m.email,
            email: m.email,
            role: m.role,
            active: m.active,
            assignedLeads: m._count.assignedLeads,
          })),
        };
      },
    }),

    draftFollowUp: tool({
      description:
        'Fetch what you need to draft a follow-up email to a lead. This returns context only ' +
        '— it never sends anything. Write the draft yourself from what comes back, and tell ' +
        'the user to review and send it themselves.',
      inputSchema: z.object({
        leadId: z.string(),
        tone: z
          .enum(['friendly', 'professional', 'direct', 'apologetic'])
          .default('professional'),
      }),
      execute: async ({ leadId, tone }) => {
        const lead = await prisma.lead.findUnique({
          where: { id: leadId },
          include: { assignedTo: true },
        });
        if (!lead) return { found: false, reason: 'No lead with that id.' };

        if (!isAdmin && lead.assignedToId !== profile.id) {
          return { found: false, denied: true, reason: 'That lead is not assigned to this user.' };
        }

        const daysSince = Math.floor(
          (Date.now() - lead.createdAt.getTime()) / (24 * 60 * 60 * 1000),
        );

        return {
          found: true,
          tone,
          sender: { name: profile.name ?? profile.email, email: profile.email },
          lead: presentLead(lead),
          daysSinceEnquiry: daysSince,
          instruction:
            'Write the email body only — no headers, no send. Reference their actual enquiry, ' +
            'keep it under 150 words, and end with one clear next step. Then remind the user ' +
            'to review it and send it from their own mail client.',
        };
      },
    }),
  };
}
