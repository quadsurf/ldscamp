import { describe, it, expect, vi } from 'vitest'
import { createClient } from './client'
import * as ssr from '@supabase/ssr'

vi.mock('@supabase/ssr', () => ({
  createBrowserClient: vi.fn()
}))

describe('Supabase Browser Client', () => {
  it('initializes with the correct environment variables', () => {
    process.env.NEXT_PUBLIC_SUPABASE_URL = 'https://test-url.supabase.co'
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = 'test-anon-key'

    createClient()

    expect(ssr.createBrowserClient).toHaveBeenCalledWith(
      'https://test-url.supabase.co',
      'test-anon-key'
    )
  })
})
