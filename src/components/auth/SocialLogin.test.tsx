import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import SocialLogin from './SocialLogin'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

// Mock dependencies
vi.mock('@/lib/supabase/client', () => ({
  createClient: vi.fn()
}))

vi.mock('next/navigation', () => ({
  useRouter: vi.fn()
}))

vi.mock('next/script', () => ({
  default: () => <div data-testid="next-script" />
}))

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'auth.continueWithGoogle': 'Continue with Google',
        'auth.connecting': 'Connecting...',
      };
      return translations[key] || key;
    },
  }),
}))

describe('SocialLogin', () => {
  const mockSignInWithOAuth = vi.fn()
  const mockSignInWithIdToken = vi.fn()
  const mockRouterPush = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    vi.mocked(useRouter).mockReturnValue({ push: mockRouterPush } as any)
    vi.mocked(createClient).mockReturnValue({
      auth: {
        signInWithOAuth: mockSignInWithOAuth,
        signInWithIdToken: mockSignInWithIdToken
      }
    } as any)
    process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID = 'mock-client-id'
  })

  it('renders the fallback login button', () => {
    render(<SocialLogin />)
    expect(screen.getByText('Continue with Google')).toBeInTheDocument()
  })

  it('triggers Google OAuth fallback when clicked', async () => {
    mockSignInWithOAuth.mockResolvedValue({ error: null })
    render(<SocialLogin />)
    
    const button = screen.getByText('Continue with Google')
    fireEvent.click(button)
    
    expect(mockSignInWithOAuth).toHaveBeenCalledWith({
      provider: 'google',
      options: {
        redirectTo: expect.stringContaining('/auth/callback')
      }
    })
  })

  it('displays loading state while connecting', async () => {
    mockSignInWithOAuth.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))
    render(<SocialLogin />)
    
    const button = screen.getByText('Continue with Google')
    fireEvent.click(button)
    
    expect(screen.getByText('Connecting...')).toBeInTheDocument()
  })
})
