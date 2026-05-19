'use client'

import { useState } from 'react'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Upload, Tent, Check } from 'lucide-react'

const schema = z.object({
  name: z.string().min(2, 'Group name must be at least 2 characters'),
  slug: z.string()
    .min(2, 'URL slug must be at least 2 characters')
    .regex(/^[a-z0-9-]+$/, 'Slug can only contain lowercase letters, numbers, and hyphens'),
  slogan: z.string().optional(),
  logo_url: z.string().optional(),
})

export default function NewGroupRegistrationPage() {
  const router = useRouter()
  const supabase = createClient()
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    slogan: '',
    logo_url: ''
  })
  
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [submitError, setSubmitError] = useState('')

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError('')

    try {
      const authRes = await fetch('/api/imagekit/auth')
      if (!authRes.ok) throw new Error('Failed to authenticate with ImageKit')
      const authData = await authRes.json()
      
      if (authData.error) throw new Error(authData.error)

      const payload = new FormData()
      payload.append('file', file)
      payload.append('publicKey', authData.publicKey)
      payload.append('signature', authData.signature)
      payload.append('expire', authData.expire)
      payload.append('token', authData.token)
      payload.append('fileName', file.name)
      payload.append('folder', '/logos')

      const uploadRes = await fetch('https://upload.imagekit.io/api/v1/files/upload', {
        method: 'POST',
        body: payload,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.message || 'Upload failed')
      }

      const uploadData = await uploadRes.json()
      setFormData(prev => ({ ...prev, logo_url: uploadData.url }))
    } catch (err: any) {
      setUploadError(err.message || 'Failed to upload logo')
    } finally {
      setIsUploading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    if (errors[e.target.name]) {
      setErrors(prev => ({ ...prev, [e.target.name]: '' }))
    }
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError('')
    setErrors({})
    
    const parseResult = schema.safeParse(formData)
    if (!parseResult.success) {
      const fieldErrors: Record<string, string> = {}
      parseResult.error.issues.forEach(e => {
        if (e.path[0]) fieldErrors[e.path[0].toString()] = e.message
      })
      setErrors(fieldErrors)
      return
    }

    setIsSubmitting(true)
    
    // Call the RPC function
    const { error } = await supabase.rpc('create_new_group', {
      p_name: formData.name,
      p_slug: formData.slug,
      p_slogan: formData.slogan || null,
      p_logo_url: formData.logo_url || null
    })

    if (error) {
      setIsSubmitting(false)
      if (error.message.includes('unique constraint') || error.message.includes('duplicate key')) {
        setSubmitError('This URL slug is already taken. Please choose another one.')
      } else {
        setSubmitError(error.message)
      }
      return
    }

    // Redirect to their new dashboard
    router.push(`/${formData.slug}/dash`)
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-indigo-200">
            <Tent className="w-8 h-8" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold text-slate-900 tracking-tight">Register Your Group</h2>
          <p className="mt-2 text-slate-600 text-lg">Setup your organization's workspace</p>
        </div>

        <div className="bg-white py-10 px-6 shadow-xl shadow-slate-200/50 sm:rounded-2xl sm:px-12 border border-slate-100">
          <form className="space-y-6" onSubmit={onSubmit}>
            {submitError && (
              <div className="bg-red-50 text-red-600 p-4 rounded-md text-sm border border-red-200 flex items-center">
                <span className="font-semibold mr-2">Error:</span> {submitError}
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-slate-700">
                Group / Camp Name <span className="text-red-500">*</span>
              </label>
              <div className="mt-2">
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g. Alpine Stake Youth Conference"
                  value={formData.name}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 font-medium">{errors.name}</p>}
              </div>
            </div>

            <div>
              <label htmlFor="slug" className="block text-sm font-semibold text-slate-700">
                URL Slug <span className="text-red-500">*</span>
              </label>
              <div className="mt-2 flex rounded-xl shadow-sm">
                <span className="inline-flex items-center px-4 rounded-l-xl border border-r-0 border-slate-300 bg-slate-50 text-slate-500 sm:text-sm font-mono">
                  ldscamp.app/
                </span>
                <input
                  id="slug"
                  name="slug"
                  type="text"
                  placeholder="alpine-stake-2026"
                  value={formData.slug}
                  onChange={handleChange}
                  className="flex-1 min-w-0 block w-full px-4 py-3 border border-slate-300 rounded-none rounded-r-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm font-mono transition-shadow"
                />
              </div>
              <p className="mt-1.5 text-xs text-slate-500">This will be the unique link parents and leaders use to register.</p>
              {errors.slug && <p className="mt-1 text-sm text-red-600 font-medium">{errors.slug}</p>}
            </div>

            <div>
              <label htmlFor="slogan" className="block text-sm font-semibold text-slate-700">
                Camp Theme / Slogan <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-2">
                <input
                  id="slogan"
                  name="slogan"
                  type="text"
                  placeholder="e.g. Trust in the Lord"
                  value={formData.slogan}
                  onChange={handleChange}
                  className="appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-shadow"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700">
                Group Logo <span className="text-slate-400 font-normal">(Optional)</span>
              </label>
              <div className="mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl relative overflow-hidden group hover:border-indigo-400 hover:bg-indigo-50 transition-all bg-slate-50">
                <div className="space-y-2 text-center">
                  {isUploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2 className="mx-auto h-12 w-12 text-indigo-500 animate-spin" />
                      <p className="mt-3 text-sm font-medium text-indigo-600">Uploading...</p>
                    </div>
                  ) : formData.logo_url ? (
                    <div className="flex flex-col items-center">
                      <img src={formData.logo_url} alt="Logo preview" className="h-24 object-contain mb-3 rounded-md shadow-sm border border-slate-200" />
                      <div className="flex items-center text-emerald-600 text-sm font-bold bg-emerald-50 px-3 py-1 rounded-full">
                        <Check className="w-4 h-4 mr-1.5" /> Logo Uploaded
                      </div>
                      <p className="text-xs font-medium text-slate-500 mt-2 group-hover:text-indigo-600 transition-colors">Click to replace</p>
                    </div>
                  ) : (
                    <>
                      <Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-500 transition-colors duration-300" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <span className="relative cursor-pointer bg-transparent rounded-md font-semibold text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                          Upload a file
                        </span>
                        <p className="pl-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                    </>
                  )}
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                    accept="image/*"
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </div>
              </div>
              {uploadError && <p className="mt-2 text-sm text-red-600 font-medium">{uploadError}</p>}
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={isSubmitting || isUploading}
                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-all hover:shadow-lg active:scale-[0.98]"
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Create Workspace'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
