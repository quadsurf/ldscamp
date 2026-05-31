import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Tent } from 'lucide-react'
import SocialLogin from '@/components/auth/SocialLogin'

export default async function StakeLandingPage({ params }: { params: { stakeSlug: string } }) {
  const supabase = await createClient()

  const { data: stake } = await supabase
    .from('stakes')
    .select('id, name, logo_url')
    .eq('slug', params.stakeSlug)
    .single()

  if (!stake) {
    redirect('/')
  }

  // If user is already logged in, redirect them to the dash
  const { data: { user } } = await supabase.auth.getUser()
  if (user) {
    redirect(`/${params.stakeSlug}/dash`)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        {stake.logo_url ? (
          <img src={stake.logo_url} alt={stake.name} className="mx-auto h-24 w-auto object-contain" />
        ) : (
          <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-200">
            <Tent className="w-10 h-10" />
          </div>
        )}
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome to {stake.name} Summer Camp
        </h2>
        <p className="mt-2 text-base text-slate-600">
          Parents, sign in below to register your youth for upcoming camps.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-10 border border-slate-100">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 text-center">Register for Camp</h3>
          </div>
          
          <SocialLogin redirectTo={`/${params.stakeSlug}/dash`} />

          <div className="mt-6 text-center text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  )
}
