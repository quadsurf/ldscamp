'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { adultLeaderRegistrationSchema, AdultLeaderRegistrationValues } from './schema/adultLeaderRegistration';
import { ImageKitUploader } from '../ui/ImageKitUploader';
import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';

interface Props {
  stakeSlug: string;
  roles: string[];
}

export const AdultLeaderRegistrationForm: React.FC<Props> = ({ stakeSlug, roles }) => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [useSocial, setUseSocial] = useState(false);

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<AdultLeaderRegistrationValues>({
    resolver: zodResolver(adultLeaderRegistrationSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      profilePicUrl: '',
    }
  });

  const onSubmit = async (data: AdultLeaderRegistrationValues) => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error('Authentication required. If you received an invite, please ensure you clicked the link and set your password first.');
      }

      // Update profiles
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          first_name: data.firstName,
          last_name: data.lastName,
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      // Ensure stake_id is found
      const { data: stakeData } = await supabase.from('stakes').select('id').eq('slug', stakeSlug).single();
      
      if (stakeData) {
        // Attempt role assignments (in real app may require RPC or elevated privileges)
        for (const role of roles) {
          const { data: roleData } = await supabase.from('roles').select('id').eq('name', role).single();
          if (roleData) {
            await supabase.from('profile_roles').insert({ profile_id: user.id, role_id: roleData.id });
          }
        }

        // Insert camp_attendees row
        const { error: attendeeError } = await supabase
          .from('camp_attendees')
          .insert({
            stake_id: stakeData.id,
            parent_id: user.id,
            profile_id: user.id,
            slug: `${data.firstName.toLowerCase()}-${data.lastName.toLowerCase()}-${Math.random().toString(36).substr(2, 5)}`,
            attendee_type: 'adult_leader',
            registration_data: { phone: data.phone, profilePicUrl: data.profilePicUrl }
          });
        
        if (attendeeError) throw attendeeError;
      }

      router.push(`/${stakeSlug}/dash`);
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/${stakeSlug}/dash/leader-signup?roles=${roles.join(',')}`
      }
    });
    if (error) setError(error.message);
  };

  return (
    <div className="max-w-xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-slate-100">
      <h2 className="text-3xl font-extrabold text-slate-900 mb-6 text-center">Adult Leader Registration</h2>
      
      {!useSocial ? (
        <div className="mb-8">
          <p className="text-slate-600 mb-4 text-center">Quickly sign up using your social account.</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="px-6 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600 transition-colors shadow-sm"
              type="button"
            >
              Sign up with Google
            </button>
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
              type="button"
            >
              Sign up with Facebook
            </button>
          </div>
          <div className="mt-6 flex items-center justify-center">
            <span className="text-slate-400 text-sm">or continue with email below</span>
          </div>
        </div>
      ) : null}

      {error && <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">{error}</div>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
            <input 
              id="firstName"
              {...register('firstName')} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
            {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
          </div>
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
            <input 
              id="lastName"
              {...register('lastName')} 
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
            />
            {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">Email</label>
          <input 
            id="email"
            type="email"
            {...register('email')} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-1">Phone Number</label>
          <input 
            id="phone"
            {...register('phone')} 
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-shadow"
          />
          {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Profile Picture</label>
          <div className="p-4 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50">
            <ImageKitUploader 
              onSuccess={(url) => setValue('profilePicUrl', url, { shouldValidate: true })} 
              onError={(err) => setError('Image upload failed.')}
            />
          </div>
          {errors.profilePicUrl && <p className="text-red-500 text-xs mt-1">{errors.profilePicUrl.message}</p>}
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="w-full py-3 bg-slate-900 text-white rounded-lg font-bold text-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
        >
          {loading ? 'Submitting...' : 'Complete Registration'}
        </button>
      </form>
    </div>
  );
};
