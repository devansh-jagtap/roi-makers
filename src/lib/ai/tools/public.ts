import { tool } from 'ai';
import { z } from 'zod';
import { company } from '@/data/site';
import { createLead } from '@/lib/leads';
import {
  aboutBrief,
  blogIndex,
  careerInfo,
  caseStudyList,
  companyBrief,
  faqList,
  findServices,
  serviceDetail,
  serviceIndex,
} from '../knowledge';
import { rememberVisitor } from '../memory';

/**
 * Tools for the public site assistant.
 *
 * Everything here reads from `src/data/site.ts` — the same content the pages
 * render. The assistant has no read access to the CRM at all; the single write
 * it can perform is creating a lead, which is what the contact form does too.
 */

type PublicToolContext = {
  conversationId: string;
  /** Page the visitor was on, recorded on the lead for attribution. */
  landingPage?: string | null;
};

export function publicTools(context: PublicToolContext) {
  return {
    listServices: tool({
      description:
        'List every service ROI Makers offers, with its site path. Use this when the visitor ' +
        'asks what the agency does, or when you need the correct slug for lookupService.',
      inputSchema: z.object({}),
      execute: async () => ({ services: serviceIndex() }),
    }),

    lookupService: tool({
      description:
        'Get full detail on one service — what it covers, the approach, capabilities and ' +
        'numbers. Accepts a slug, or a plain-language query like "facebook ads" or ' +
        '"ranking on google", which is matched against the catalogue.',
      inputSchema: z.object({
        query: z
          .string()
          .describe('A service slug, or what the visitor asked about in their own words.'),
      }),
      execute: async ({ query }) => {
        const direct = serviceDetail(query.trim().toLowerCase());
        if (direct) return direct;

        const matches = findServices(query);
        if (!matches.length) {
          return {
            found: false,
            message: 'No service matches that. Offer the full list with listServices instead.',
          };
        }

        const best = serviceDetail(matches[0].slug);
        return { ...best, alsoRelevant: matches.slice(1, 4) };
      },
    }),

    getCompanyInfo: tool({
      description:
        'Company facts: what ROI Makers is, where it is based, contact details, mission, ' +
        'vision, headline numbers, the founding story, values, leadership and testimonials.',
      inputSchema: z.object({}),
      execute: async () => ({ profile: companyBrief(), ...aboutBrief() }),
    }),

    getFaqs: tool({
      description:
        'The published FAQs — how the agency differs from others, onboarding timeline, ' +
        'industries served, reporting, and how engagements work. Pass a topic to narrow it.',
      inputSchema: z.object({
        topic: z.string().optional().describe('Optional keyword to filter the FAQs.'),
      }),
      execute: async ({ topic }) => ({ faqs: faqList(topic) }),
    }),

    listCaseStudies: tool({
      description:
        'Published client work with real, verified results. Use this when a visitor asks ' +
        'for proof, examples, or work in their industry. Never invent a case study.',
      inputSchema: z.object({
        category: z
          .string()
          .optional()
          .describe('Optional category filter, e.g. "SEO" or "Nutraceuticals".'),
      }),
      execute: async ({ category }) => ({ caseStudies: caseStudyList(category) }),
    }),

    getOpenRoles: tool({
      description:
        'Current job openings, required experience, skills and employee benefits. Use this ' +
        'when the visitor is asking about a job rather than about hiring the agency.',
      inputSchema: z.object({}),
      execute: async () => careerInfo(),
    }),

    listBlogPosts: tool({
      description:
        'Published articles from the ROI Makers blog, with their site paths. Useful when a ' +
        'visitor wants to read more about a topic.',
      inputSchema: z.object({
        topic: z.string().optional().describe('Optional keyword to filter posts.'),
      }),
      execute: async ({ topic }) => ({ posts: blogIndex(topic) }),
    }),

    captureLead: tool({
      description:
        'Submit the visitor\'s enquiry to the ROI Makers team. This creates a real record and ' +
        'emails the team, so call it ONCE and only after the visitor has explicitly confirmed ' +
        'the details you read back to them. Never call it with details you invented or assumed.',
      inputSchema: z.object({
        name: z.string().min(1).describe("The visitor's full name, as they gave it."),
        email: z.string().min(3).describe('A valid email address the team can reply to.'),
        service: z
          .string()
          .min(1)
          .describe('The service they are interested in. Use a real service name.'),
        message: z
          .string()
          .min(1)
          .describe('What they need, in their own words where possible.'),
        phone: z.string().optional(),
        companyName: z.string().optional().describe('Their company or brand name.'),
        budget: z.string().optional().describe('Only if the visitor volunteered a budget.'),
      }),
      execute: async ({ name, email, service, message, phone, companyName, budget }) => {
        try {
          const result = await createLead({
            name,
            email,
            service,
            message,
            phone,
            company: companyName,
            budget,
            source: 'ai-chat',
            landingPage: context.landingPage,
          });

          if (!result.ok) {
            return {
              submitted: false,
              error: result.error,
              instruction:
                'Tell the visitor what was wrong (usually the email address), ask them to ' +
                'correct it, and try again.',
            };
          }

          await rememberVisitor(context.conversationId, {
            visitorName: name,
            visitorEmail: email,
            leadId: result.lead.id,
          });

          return {
            submitted: true,
            instruction:
              `Confirm to ${name} that the enquiry is with the team and someone will be in ` +
              `touch. Offer ${company.emails.general} and ${company.phones[0]} as a direct route.`,
          };
        } catch (error) {
          console.error('[ai] captureLead failed', error);
          return {
            submitted: false,
            error: 'submission_failed',
            instruction:
              `Apologise, and ask them to use the /contact page or email ${company.emails.general} instead.`,
          };
        }
      },
    }),
  };
}
