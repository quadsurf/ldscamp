'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'

export default function ParentSignup({ params }: { params: { stakeSlug: string } }) {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [entityId, setEntityId] = useState('')
  const [entities, setEntities] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Create a supabase client strictly for the browser
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  useEffect(() => {
    async function loadEntities() {
      // Get stake_id from slug
      const { data: stake } = await supabase
        .from('stakes')
        .select('id')
        .eq('slug', params.stakeSlug)
        .single()

      if (stake) {
        const { data } = await supabase
          .from('entities')
          .select('id, name, entity_type')
          .eq('stake_id', stake.id)
          .order('name')
        
        if (data) setEntities(data)
      }
    }
    loadEntities()
  }, [params.stakeSlug, supabase])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!phone || !entityId) {
      setError('Please fill in all fields.')
      setLoading(false)
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        phone,
        entity_id: entityId
      })
      .eq('id', user.id)

    if (updateError) {
      setError(updateError.message)
      setLoading(false)
    } else {
      router.push(`/${params.stakeSlug}/dash`)
      router.refresh()
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 border border-slate-200 shadow-sm rounded-xl mt-8">
      <h2 className="text-2xl font-bold text-slate-900 mb-2">Complete Your Profile</h2>
      <p className="text-slate-600 mb-6">Before you can register your youth for camp, please provide your contact info and select your Ward or Branch.</p>

      {error && (
        <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm font-medium">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="phone" className="block text-sm font-medium leading-6 text-slate-900">
            Cell Phone Number
          </label>
          <div className="mt-2">
            <input
              id="phone"
              name="phone"
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 placeholder:text-slate-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            />
          </div>
        </div>

        <div>
          <label htmlFor="ward" className="block text-sm font-medium leading-6 text-slate-900">
            Select Your Ward / Branch
          </label>
          <div className="mt-2">
            <select
              id="ward"
              name="ward"
              required
              value={entityId}
              onChange={(e) => setEntityId(e.target.value)}
              className="block w-full rounded-md border-0 py-1.5 text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              <option value="" disabled>Select an option...</option>
              {entities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.name} ({entity.entity_type})
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <button
            type="submit"
            disabled={loading}
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save & Continue'}
          </button>
        </div>
      </form>
    </div>
  )
}
