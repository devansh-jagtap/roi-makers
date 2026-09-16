/**
 * Bootstrap the very first ADMIN account (and optionally wipe every existing user).
 *
 * Usage (from the repo root, reads .env.local):
 *   node scripts/bootstrap-admin.mjs --email admin@roimakers.in --password "StrongPass123!" --name "Admin"
 *   node scripts/bootstrap-admin.mjs --reset --email admin@roimakers.in --password "StrongPass123!" --name "Admin"
 *
 * --reset      deletes EVERY Supabase Auth user and EVERY row in `profiles` first.
 *              Leads keep their data; their `assigned_to` is cleared by the DB (ON DELETE SET NULL).
 * --wipe-data  also empties every dashboard table: leads, newsletter_subscribers,
 *              career_applications, chat_conversations (+ chat_messages). Schema is untouched,
 *              so no Prisma migration is needed afterwards.
 *
 * Requires SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_SUPABASE_URL and DIRECT_URL (or DATABASE_URL) in .env.local.
 * Uses the direct (non-pooled) connection like the Prisma CLI does; the pooler cannot run transactions.
 */
import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

config({ path: '.env.local' });

const args = process.argv.slice(2);
const flag = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};
const reset = args.includes('--reset');
const wipeData = args.includes('--wipe-data');
const email = (flag('email') ?? '').trim().toLowerCase();
const password = flag('password') ?? '';
const name = (flag('name') ?? 'Admin').trim();

if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
  console.error('A valid --email is required.');
  process.exit(1);
}
if (password.length < 8) {
  console.error('--password must be at least 8 characters.');
  process.exit(1);
}
const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;
for (const key of ['NEXT_PUBLIC_SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY']) {
  if (!process.env[key]) {
    console.error(`${key} is missing from .env.local`);
    process.exit(1);
  }
}
if (!connectionString) {
  console.error('DIRECT_URL (or DATABASE_URL) is missing from .env.local');
  process.exit(1);
}

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
const prisma = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });

async function listAllAuthUsers() {
  const users = [];
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage: 1000 });
    if (error) throw error;
    users.push(...data.users);
    if (data.users.length < 1000) break;
  }
  return users;
}

async function main() {
  if (wipeData) {
    console.log('Wiping dashboard data...');
    const chats = await prisma.chatConversation.deleteMany({}); // chat_messages cascade
    const careers = await prisma.careerApplication.deleteMany({});
    const subs = await prisma.newsletterSubscriber.deleteMany({});
    const leads = await prisma.lead.deleteMany({});
    console.log(`  chat conversations: ${chats.count}, career applications: ${careers.count}, subscribers: ${subs.count}, leads: ${leads.count}`);
  }

  if (reset) {
    const users = await listAllAuthUsers();
    console.log(`Reset: deleting ${users.length} auth user(s) and all profiles...`);
    for (const u of users) {
      const { error } = await supabase.auth.admin.deleteUser(u.id);
      if (error) throw error;
      console.log(`  deleted auth user ${u.email ?? u.id}`);
    }
    const { count } = await prisma.profile.deleteMany({});
    console.log(`  deleted ${count} profile row(s)`);
  }

  // Reuse the auth user if the email already exists, otherwise create a confirmed one.
  const existing = (await listAllAuthUsers()).find((u) => (u.email ?? '').toLowerCase() === email);
  let authUserId;
  if (existing) {
    authUserId = existing.id;
    const { error } = await supabase.auth.admin.updateUserById(authUserId, {
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (error) throw error;
    console.log(`Auth user already existed - password reset for ${email}`);
  } else {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: { name },
    });
    if (error) throw error;
    authUserId = data.user.id;
    console.log(`Created auth user ${email}`);
  }

  const profile = await prisma.profile.upsert({
    where: { email },
    update: { authUserId, name, role: 'ADMIN', active: true },
    create: { authUserId, email, name, role: 'ADMIN', active: true },
  });
  console.log(`Profile ready: ${profile.email} (${profile.role}, id ${profile.id})`);
  console.log(`\nDone. Log in at ${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/login with that email and password.`);
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
