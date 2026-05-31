'use server';

import { createClient } from '@supabase/supabase-js';

export async function inviteLeader(
  stakeSlug: string,
  firstName: string,
  email: string,
  roles: string[],
  domain: string
) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error('Server misconfiguration: Supabase Service Role Key is missing.');
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const params = new URLSearchParams();
  roles.forEach(role => params.append('role', role));

  const redirectTo = `${domain}/${stakeSlug}/dash/leader-signup?${params.toString()}`;

  const { data, error } = await adminClient.auth.admin.inviteUserByEmail(email, {
    data: {
      first_name: firstName,
      invited_roles: roles,
    },
    redirectTo,
  });

  if (error) {
    throw new Error(error.message);
  }

  return { success: true };
}
