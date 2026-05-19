'use client'

import { createClient } from '@/utils/supabase/client'
import Script from 'next/script'

export default function GoogleOneTapLogin() {
  const supabase = createClient()

  // Triggered by Google once the user clicks the One Tap prompt
  const handleCredentialResponse = async (response: google.accounts.id.CredentialResponse) => {
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'google',
      token: response.credential, // The JWT returned by FedCM
      // nonce: 'your-hashed-nonce' // Highly recommended to prevent replay attacks
    })

    if (error) {
      console.error('Supabase Auth Error:', error.message)
      return
    }
    
    console.log('Successfully logged in with Google!', data.user)
  }

  return (
    <>
      <Script 
        src="https://accounts.google.com/gsi/client" 
        strategy="afterInteractive"
        onLoad={() => {
          google.accounts.id.initialize({
            client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
            callback: handleCredentialResponse,
            // FedCM is enabled by default in modern Google Identity Services
          })
          google.accounts.id.prompt() // Displays the FedCM One Tap UI
        }}
      />
      {/* Implement fallback standard login buttons here */}
    </>
  )
}