import { describe, it, expect, vi } from 'vitest'
import { createClient } from './server'
import * as ssr from '@supabase/ssr'
import { cookies } from 'next/headers'

// Mock dependencies
vi.mock('@supabase/ssr', () => ({
  createServerClient: vi.fn()
}))

vi.mock('next/headers', () => ({
  cookies: vi.fn()
}))

describe('Supabase Server Client', () => {
  it('initializes with the correct environment variables and cookie handlers', async () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-url.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'
    
    const mockCookieStore = {
      getAll: vi.fn(),
      set: vi.fn()
    }
    vi.mocked(cookies).mockResolvedValue(mockCookieStore as any)

    await createClient()

    expect(ssr.createServerClient).toHaveBeenCalledWith(
      'https://test-url.supabase.co',
      'test-anon-key',
      expect.objectContaining({
        cookies: expect.any(Object)
      })
    )
  })
})
