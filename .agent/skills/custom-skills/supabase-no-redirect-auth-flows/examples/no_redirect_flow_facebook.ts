'use client'

import { createClient } from '@/utils/supabase/client'
import Script from 'next/script'

// Ensure TypeScript recognizes the global FB object
declare global {
  interface Window {
    FB: any;
  }
}

export default function FacebookLogin() {
  const supabase = createClient()

  const handleFacebookLogin = () => {
    // Trigger the Facebook native popup
    window.FB.login(async (response: any) => {
      if (response.authResponse) {
        // Facebook returns an Access Token, not an OIDC ID token
        const accessToken = response.authResponse.accessToken;

        // Supabase abstracts the difference, pass the access token directly
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'facebook',
          token: accessToken, 
        })

        if (error) {
          console.error('Supabase Auth Error:', error.message)
          return
        }

        console.log('Successfully logged in with Facebook!', data.user)
      } else {
        console.log('User cancelled login or did not fully authorize.')
      }
    }, { scope: 'public_profile,email' });
  }

  return (
    <>
      <Script
        src="https://connect.facebook.net/en_US/sdk.js"
        strategy="lazyOnload"
        onLoad={() => {
          window.FB.init({
            appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID!,
            cookie: true,
            xfbml: true,
            version: 'v19.0'
          });
        }}
      />
      <button onClick={handleFacebookLogin}>
        Log in with Facebook (No Redirect)
      </button>
    </>
  )
}