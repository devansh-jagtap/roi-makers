-- Prisma uses a server database connection. Keep direct browser table access denied.
alter table public.profiles enable row level security;
alter table public.leads enable row level security;
alter table public.newsletter_subscribers enable row level security;

-- The application uses authenticated server routes and Prisma for dashboard access.
-- No public SELECT/INSERT/UPDATE/DELETE policies are intentionally created.
-- If you later query from the browser, add narrowly scoped policies first.
