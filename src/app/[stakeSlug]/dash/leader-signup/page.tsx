import React from 'react';
import { AdultLeaderRegistrationForm } from '@/components/forms/AdultLeaderRegistrationForm';

export default async function LeaderSignupPage(props: {
  params: Promise<{ stakeSlug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { stakeSlug } = await props.params;
  const searchParams = await props.searchParams;
  const roleParam = searchParams.role;

  let roles: string[] = [];
  if (Array.isArray(roleParam)) {
    roles = roleParam;
  } else if (typeof roleParam === 'string') {
    roles = [roleParam];
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full">
        <AdultLeaderRegistrationForm stakeSlug={stakeSlug} roles={roles} />
      </div>
    </div>
  );
}
