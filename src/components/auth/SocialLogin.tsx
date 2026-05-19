'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Script from 'next/script'
import { useTranslation } from 'react-i18next'

export default function SocialLogin({ redirectTo = '/admin/dash' }: { redirectTo?: string }) {
  const { t } = useTranslation('common')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()
  const router = useRouter()

  useEffect(() => {
    // Only initialize Google One Tap if clientId is provided
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
    if (!googleClientId) return

    const handleGoogleResponse = async (response: any) => {
      setLoading(true)
      try {
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.credential,
        })
        
        if (error) throw error
        
        // Push to dashboard upon success
        router.push(redirectTo)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    // Attach to window so Google script can call it
    window.handleGoogleResponse = handleGoogleResponse

    // Initialize FedCM / One Tap
    const initGoogle = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: window.handleGoogleResponse,
          auto_select: true, // Attempt to automatically select previously used account
          use_fedcm_for_prompt: true, // Use modern FedCM API
        })
        window.google.accounts.id.prompt()
      }
    }

    // Attempt init
    initGoogle()
  }, [supabase, router])

  // Standard fallback login
  const handleFallbackLogin = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
      },
    })
    if (error) {
      setError(error.message)
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
      
      <button
        onClick={handleFallbackLogin}
        disabled={loading}
        className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        {loading ? t('auth.connecting') : t('auth.continueWithGoogle')}
      </button>

      {error && (
        <p className="text-sm text-red-600 mt-2">{error}</p>
      )}
    </div>
  )
}

declare global {
  interface Window {
    google?: any;
    handleGoogleResponse?: (response: any) => void;
  }
}
