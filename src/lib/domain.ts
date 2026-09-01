// Browser-safe domain values. Do not import Prisma in Client Components.
export const LEAD_STATUSES = [
  'NEW',
  'CONTACTED',
  'QUALIFIED',
  'PROPOSAL',
  'WON',
  'LOST',
] as const;

export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const CAREER_APPLICATION_STATUSES = [
  'NEW',
  'REVIEWING',
  'SHORTLISTED',
  'REJECTED',
  'HIRED',
] as const;

export type CareerApplicationStatus = (typeof CAREER_APPLICATION_STATUSES)[number];
