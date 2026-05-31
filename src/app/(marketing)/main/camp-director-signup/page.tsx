'use client'

import SocialLogin from '@/components/auth/SocialLogin'
import { useTranslation } from 'react-i18next'
import { Tent, Users, Calendar, ShieldCheck } from 'lucide-react'

export default function CampDirectorSignupPage() {
  const { t } = useTranslation('common')

  const benefits = [
    {
      title: 'Effortless Registration',
      description: 'Collect camper data, medical releases, and digital signatures seamlessly.',
      icon: <Users className="w-5 h-5 text-indigo-600" />
    },
    {
      title: 'Dynamic Form Builder',
      description: 'Create custom forms with powerful validation and conditional logic.',
      icon: <Tent className="w-5 h-5 text-indigo-600" />
    },
    {
      title: 'Secure & Compliant',
      description: 'Role-based access control and strict data isolation for your entire stake or entity.',
      icon: <ShieldCheck className="w-5 h-5 text-indigo-600" />
    },
    {
      title: 'Automated Planning',
      description: 'Easily organize wards, track quotas, and manage adult leadership.',
      icon: <Calendar className="w-5 h-5 text-indigo-600" />
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-200">
          <Tent className="w-8 h-8" />
        </div>
        <h2 className="mt-6 text-3xl font-extrabold text-slate-900 tracking-tight">
          Start Your Camp Journey
        </h2>
        <p className="mt-2 text-base text-slate-600">
          Join thousands of Camp Directors organizing better summer camps.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[900px]">
        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-12 grid grid-cols-1 md:grid-cols-2 gap-12 border border-slate-100">
          
          {/* Left Column: Benefits */}
          <div className="flex flex-col justify-center border-b md:border-b-0 md:border-r border-slate-100 pb-10 md:pb-0 md:pr-12">
            <h3 className="text-xl font-bold text-slate-900 mb-8">Why use our platform?</h3>
            <div className="space-y-8">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                      {benefit.icon}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-base font-semibold text-slate-900">{benefit.title}</h4>
                    <p className="mt-1 text-sm text-slate-500 leading-relaxed">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Signup */}
          <div className="flex flex-col justify-center py-4">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 text-center">Create your account</h3>
              <p className="text-sm text-slate-500 text-center mt-2">Get started in seconds. No credit card required.</p>
            </div>
            
            <div className="px-4">
              <SocialLogin redirectTo="/main/new-group-registration" />
            </div>

            <div className="mt-8 text-center text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              By signing up, you agree to our Terms of Service and Privacy Policy.
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
