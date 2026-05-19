'use client'

import { createClient } from '@/utils/supabase/client'
import Script from 'next/script'

// Ensure TypeScript recognizes the global AppleID object
declare global {
  interface Window {
    AppleID: any;
  }
}

export default function AppleLogin() {
  const supabase = createClient()

  const handleAppleLogin = async () => {
    try {
      // Trigger the Apple native popup
      const response = await window.AppleID.auth.signIn()
      
      // Extract the OIDC ID Token
      const idToken = response.authorization.id_token

      // Pass it to Supabase
      const { data, error } = await supabase.auth.signInWithIdToken({
        provider: 'apple',
        token: idToken,
      })

      if (error) throw error

      console.log('Successfully logged in with Apple!', data.user)
    } catch (error) {
      console.error('Apple authentication failed or was cancelled:', error)
    }
  }

  return (
    <>
      <Script 
        src="https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.AppleID.auth.init({
            clientId: process.env.NEXT_PUBLIC_APPLE_CLIENT_ID!,
            scope: 'name email',
            redirectURI: process.env.NEXT_PUBLIC_APPLE_REDIRECT_URI!,
            usePopup: true // Crucial parameter to trigger no-redirect flow
          })
        }}
      />
      <button onClick={handleAppleLogin}>
        Sign in with Apple (No Redirect)
      </button>
    </>
  )
}