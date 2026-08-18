import { requireProfile } from '@/lib/auth';
import { SetPasswordClient } from './SetPasswordClient';

export default async function SetPasswordPage() {
  // Require an active authenticated session and matching Prisma profile.
  // Unauthenticated requests are automatically redirected to /login by requireProfile().
  await requireProfile();
  
  return <SetPasswordClient />;
}
