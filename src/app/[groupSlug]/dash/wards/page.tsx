'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Plus, MapPin, Trash2 } from 'lucide-react'
import { z } from 'zod'

const wardSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  entity_type: z.enum(['Ward', 'Branch']),
})

export default function WardsManagerPage({
  params,
}: {
  params: { groupSlug: string }
}) {
  const supabase = createClient()
  
  const [groupId, setGroupId] = useState<string | null>(null)
  const [wards, setWards] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [formData, setFormData] = useState({ name: '', entity_type: 'Ward' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  useEffect(() => {
    async function loadData() {
      // Get group ID
      const { data: group } = await supabase
        .from('groups')
        .select('id')
        .eq('slug', params.groupSlug)
        .single()
        
      if (group) {
        setGroupId(group.id)
        
        // Get wards
        const { data: wardsData } = await supabase
          .from('wards')
          .select('*')
          .eq('group_id', group.id)
          .order('name')
          
        if (wardsData) setWards(wardsData)
      }
      setIsLoading(false)
    }
    
    loadData()
  }, [params.groupSlug, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const handleAddWard = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setErrors({})
    
    const parseResult = wardSchema.safeParse(formData)
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {}
      parseResult.error.issues.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0].toString()] = err.message
      })
      setErrors(fieldErrors)
      return
    }

    if (!groupId) {
      setSubmitError('Group ID not found. Please refresh.')
      return
    }

    setIsSubmitting(true)

    const { data: newWard, error } = await supabase
      .from('wards')
      .insert({
        group_id: groupId,
        name: formData.name,
        entity_type: formData.entity_type
      })
      .select()
      .single()

    if (error) {
      setIsSubmitting(false)
      setSubmitError(error.message)
      return
    }

    // Success! Update list and clear form
    setWards(prev => [...prev, newWard].sort((a, b) => a.name.localeCompare(b.name)))
    setFormData({ name: '', entity_type: 'Ward' })
    setIsSubmitting(false)
  }

  const handleDeleteWard = async (wardId: string) => {
    if (!confirm('Are you sure you want to delete this ward? Anyone assigned to it will lose their ward assignment.')) return
    
    const { error } = await supabase.from('wards').delete().eq('id', wardId)
    if (!error) {
      setWards(prev => prev.filter(w => w.id !== wardId))
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Wards & Branches</h2>
        <p className="mt-1 text-sm text-slate-500">
          Manage the local units that make up your camp group. Parents will select their ward from this list when registering.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Form Column */}
        <div className="md:col-span-1">
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4 flex items-center">
              <Plus className="w-5 h-5 mr-2 text-indigo-500" />
              Add New Unit
            </h3>
            
            <form onSubmit={handleAddWard} className="space-y-4">
              {submitError && (
                <div className="bg-red-50 text-red-600 p-3 rounded-md text-sm border border-red-200">
                  {submitError}
                </div>
              )}
              
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-slate-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="e.g. Alpine 1st"
                  value={formData.name}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                />
                {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label htmlFor="entity_type" className="block text-sm font-medium text-slate-700">
                  Type
                </label>
                <select
                  id="entity_type"
                  name="entity_type"
                  value={formData.entity_type}
                  onChange={handleChange}
                  className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                >
                  <option value="Ward">Ward</option>
                  <option value="Branch">Branch</option>
                </select>
                {errors.entity_type && <p className="mt-1 text-xs text-red-600">{errors.entity_type}</p>}
              </div>

              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Unit'}
              </button>
            </form>
          </div>
        </div>

        {/* List Column */}
        <div className="md:col-span-2">
          <div className="bg-white shadow-sm border border-slate-200 rounded-xl overflow-hidden">
            {isLoading ? (
              <div className="flex justify-center items-center p-12 text-slate-500">
                <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading units...
              </div>
            ) : wards.length === 0 ? (
              <div className="text-center p-12">
                <MapPin className="mx-auto h-12 w-12 text-slate-300" />
                <h3 className="mt-2 text-sm font-semibold text-slate-900">No units added</h3>
                <p className="mt-1 text-sm text-slate-500">Get started by creating a new ward or branch.</p>
              </div>
            ) : (
              <ul className="divide-y divide-slate-200">
                {wards.map((ward) => (
                  <li key={ward.id} className="p-4 hover:bg-slate-50 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-indigo-50 p-2 rounded-lg">
                        <MapPin className="h-5 w-5 text-indigo-600" />
                      </div>
                      <div className="ml-4">
                        <p className="text-sm font-medium text-slate-900">{ward.name} {ward.entity_type}</p>
                        <p className="text-xs text-slate-500">Added {new Date(ward.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteWard(ward.id)}
                      className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete Unit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
