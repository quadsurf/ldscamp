'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createBrowserClient } from '@supabase/ssr'
import SignatureCanvas from 'react-signature-canvas'

export default function RegisterForCamp({ params }: { params: { stakeSlug: string } }) {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [entities, setEntities] = useState<any[]>([])
  
  const signatureRef = useRef<any>(null)
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )

  const [formData, setFormData] = useState({
    // Step 1
    wardId: '',
    firstName: '',
    lastName: '',
    youthLevel: '',
    gender: '',
    age: '',
    dob: '',
    tshirtSize: '',
    cellPhone: '',
    email: '',
    homeAddress: '',
    // Step 2
    specialDiet: '',
    allergies: '',
    medications: '',
    chronicIllness: '',
    surgery: '',
    physicalConditions: '',
    anxiety: '',
    // Step 3
    otcConsent: true,
    socialMediaRelease: true,
    emergencyAuth: false,
    // Step 4
    conductAgreement: false,
    privilegeAck: false,
    // Step 5
    signatureDataUrl: '',
    signatureDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
  })

  useEffect(() => {
    async function loadData() {
      const { data: stake } = await supabase
        .from('stakes')
        .select('id')
        .eq('slug', params.stakeSlug)
        .single()

      if (stake) {
        const { data: wards } = await supabase
          .from('entities')
          .select('id, name, entity_type')
          .eq('stake_id', stake.id)
          .order('name')
        
        if (wards) setEntities(wards)
      }
    }
    loadData()
  }, [params.stakeSlug, supabase])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked
      setFormData(prev => ({ ...prev, [name]: checked }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const nextStep = () => {
    // Basic validation before advancing
    if (currentStep === 1) {
      if (!formData.wardId || !formData.firstName || !formData.lastName || !formData.youthLevel || !formData.gender || !formData.age || !formData.dob || !formData.tshirtSize || !formData.homeAddress) {
        setError('Please fill in all required fields.')
        return
      }
    }
    if (currentStep === 3) {
      if (!formData.emergencyAuth) {
        setError('You must authorize emergency treatment to proceed.')
        return
      }
    }
    if (currentStep === 4) {
      if (!formData.conductAgreement || !formData.privilegeAck) {
        setError('You must agree to all terms to proceed.')
        return
      }
    }
    
    setError('')
    setCurrentStep(prev => prev + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setError('')
    setCurrentStep(prev => prev - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async () => {
    setError('')
    
    if (signatureRef.current?.isEmpty()) {
      setError('Please provide your signature.')
      return
    }
    
    setLoading(true)

    // Save signature
    const signatureDataUrl = signatureRef.current?.getTrimmedCanvas().toDataURL('image/png')
    
    // Generate unique slug (firstName + lastName + dayOfMonth)
    const day = new Date(formData.dob).getDate().toString().padStart(2, '0')
    const baseSlug = `${formData.firstName}${formData.lastName}${day}`.toLowerCase().replace(/[^a-z0-9]/g, '')
    
    // Ensure slug is unique by potentially appending random chars if collision occurs
    let finalSlug = baseSlug

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const { data: stake } = await supabase
      .from('stakes')
      .select('id')
      .eq('slug', params.stakeSlug)
      .single()

    if (!stake) return

    // Verify uniqueness
    const { data: existing } = await supabase
      .from('camp_attendees')
      .select('slug')
      .eq('stake_id', stake.id)
      .eq('slug', baseSlug)
    
    if (existing && existing.length > 0) {
      finalSlug = `${baseSlug}${Math.floor(Math.random() * 1000)}`
    }

    const payload = { ...formData, signatureDataUrl }

    const { data: insertedData, error: insertError } = await supabase
      .from('camp_attendees')
      .insert({
        stake_id: stake.id,
        entity_id: formData.wardId,
        parent_id: user.id,
        slug: finalSlug,
        registration_data: payload
      })
      .select('id')
      .single()

    if (insertError || !insertedData) {
      setError(insertError?.message || 'Unknown error occurred')
      setLoading(false)
    } else {
      // Import dynamically or normally, wait we can just import at the top. Let's add the import and call it.
      // But it's a Server Action. We must import it at the top of the file.
      // I'll use a dynamic import here just to avoid rewriting the top of the file if possible, 
      // or I'll just write it correctly. Next.js allows importing server actions anywhere.
      try {
        const { generateAndUploadWaiver } = await import('@/app/actions/generateWaiver')
        await generateAndUploadWaiver(insertedData.id, payload, params.stakeSlug)
      } catch (e) {
        console.error("Failed to generate waiver", e)
        // Non-blocking for the user
      }

      router.push(`/${params.stakeSlug}/dash?success=true&slug=${finalSlug}`)
      router.refresh()
    }
  }

  const clearSignature = () => {
    signatureRef.current?.clear()
  }

  return (
    <div className="max-w-3xl mx-auto bg-white border border-slate-200 shadow-sm rounded-xl mt-8">
      <div className="px-8 py-6 border-b border-slate-200">
        <h2 className="text-2xl font-bold text-slate-900">Youth Registration</h2>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex space-x-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`h-2.5 w-12 rounded-full ${
                  currentStep >= step ? 'bg-indigo-600' : 'bg-slate-200'
                }`}
              />
            ))}
          </div>
          <span className="text-sm font-medium text-slate-500">Step {currentStep} of 5</span>
        </div>
      </div>

      <div className="p-8">
        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-md mb-6 text-sm font-medium">
            {error}
          </div>
        )}

        {/* STEP 1: About Your Teenager */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">About Your Teenager</h3>
            
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Ward / Branch <span className="text-red-500">*</span></label>
                <select name="wardId" value={formData.wardId} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Select...</option>
                  {entities.map(e => (
                    <option key={e.id} value={e.id}>{e.name} ({e.entity_type})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">First Name <span className="text-red-500">*</span></label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Last Name <span className="text-red-500">*</span></label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Youth Level <span className="text-red-500">*</span></label>
                <select name="youthLevel" value={formData.youthLevel} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Select...</option>
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="YCL">YCL</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Gender <span className="text-red-500">*</span></label>
                <select name="gender" value={formData.gender} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Age <span className="text-red-500">*</span></label>
                <input type="number" name="age" value={formData.age} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Date of Birth <span className="text-red-500">*</span></label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">T-shirt Size <span className="text-red-500">*</span></label>
                <select name="tshirtSize" value={formData.tshirtSize} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm">
                  <option value="">Select...</option>
                  <option value="Small">Small</option>
                  <option value="Medium">Medium</option>
                  <option value="Large">Large</option>
                  <option value="x-Large">x-Large</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Cell Ph# (Optional)</label>
                <input type="tel" name="cellPhone" value={formData.cellPhone} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Email Address (Optional)</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-sm font-medium text-slate-700">Home Address <span className="text-red-500">*</span></label>
                <input type="text" name="homeAddress" value={formData.homeAddress} onChange={handleChange} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm" />
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Health */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Your Teenager's Health</h3>
            <p className="text-sm text-slate-500 mb-4">Leave blank if not applicable.</p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700">Special Diet Instructions</label>
                <textarea name="specialDiet" rows={2} value={formData.specialDiet} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Allergy Instructions</label>
                <textarea name="allergies" rows={2} value={formData.allergies} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Medication Instructions</label>
                <textarea name="medications" rows={2} value={formData.medications} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Chronic/Recurring Illnesses</label>
                <textarea name="chronicIllness" rows={2} value={formData.chronicIllness} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Surgery or Serious Illness in the past Year</label>
                <textarea name="surgery" rows={2} value={formData.surgery} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Physical Conditions that Limit Activity</label>
                <textarea name="physicalConditions" rows={2} value={formData.physicalConditions} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700">Anxiety, Homesickness, etc</label>
                <textarea name="anxiety" rows={2} value={formData.anxiety} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"></textarea>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: Permissions */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Parent/Guardian Permissions</h3>
            
            <div className="space-y-5">
              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input type="checkbox" name="otcConsent" checked={formData.otcConsent} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-slate-900">(Optional) Over-the-Counter Medication</label>
                  <p className="text-slate-500">I give permission for the camp nurse to give my teenager over-the-counter meds (ex Tylenol, Motrin, Tums, Benadryl, etc) as needed during camp.</p>
                </div>
              </div>

              <div className="relative flex items-start">
                <div className="flex h-6 items-center">
                  <input type="checkbox" name="socialMediaRelease" checked={formData.socialMediaRelease} onChange={handleChange} className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-slate-900">(Optional) Social Media Release</label>
                  <p className="text-slate-500">I give permission for my teenager's photo/video to be taken, either individually or in group photos, and posted/shared online in forums/channels that are Church appropriate.</p>
                </div>
              </div>

              <div className="relative flex items-start p-4 bg-red-50 rounded-lg border border-red-100">
                <div className="flex h-6 items-center">
                  <input type="checkbox" name="emergencyAuth" checked={formData.emergencyAuth} onChange={handleChange} required className="h-4 w-4 rounded border-red-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-slate-900">(Required) Authorization</label>
                  <p className="text-slate-700">I give permission for my teenager to participate in this event and activities listed above (unless noted) and authorize the adult leaders supervising this event to administer emergency treatment to my above-named teenager for any accident or illness and to act in my stead in approving necessary medical care. This authorization shall cover this event and travel to and from this event.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 4: Terms */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Our Terms</h3>
            
            <div className="space-y-5">
              <div className="relative flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex h-6 items-center">
                  <input type="checkbox" name="conductAgreement" checked={formData.conductAgreement} onChange={handleChange} required className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-slate-900">(Required) Conduct</label>
                  <p className="text-slate-700">I acknowledge that my teenager shall be responsible for his/her own conduct and is aware of and agrees to abide by Church standards, camp or event safety rules, and other pertinent instructions. I agree that his/her conduct and interactions will abide by Church standards and exemplify Christlike behavior.</p>
                </div>
              </div>

              <div className="relative flex items-start p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className="flex h-6 items-center">
                  <input type="checkbox" name="privilegeAck" checked={formData.privilegeAck} onChange={handleChange} required className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-600" />
                </div>
                <div className="ml-3 text-sm leading-6">
                  <label className="font-medium text-slate-900">(Required) Acknowledgment</label>
                  <p className="text-slate-700">My teenager and I both acknowledge that participation in this event is not a right but a privilege that can be revoked if he/she behaves inappropriately or poses a risk to him/her self or others.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 5: Signature */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Signature</h3>
            <p className="text-sm text-slate-600 mb-4">Please draw your signature below to complete the registration.</p>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-slate-300 bg-slate-50 rounded-lg overflow-hidden relative" style={{ height: 200 }}>
                <SignatureCanvas 
                  ref={signatureRef} 
                  canvasProps={{ className: 'w-full h-full cursor-crosshair' }} 
                  backgroundColor="rgb(248, 250, 252)" 
                />
                <button 
                  type="button" 
                  onClick={clearSignature} 
                  className="absolute bottom-2 right-2 text-xs bg-white px-2 py-1 rounded shadow text-slate-500 hover:text-slate-700"
                >
                  Clear
                </button>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700">Signature Date</label>
                <input type="text" readOnly value={formData.signatureDate} className="mt-1 block w-full rounded-md border-slate-300 bg-slate-100 shadow-sm sm:text-sm text-slate-500 cursor-not-allowed" />
              </div>
            </div>
          </div>
        )}

        {/* NAVIGATION BUTTONS */}
        <div className="mt-10 pt-6 border-t border-slate-200 flex items-center justify-between">
          <button
            type="button"
            onClick={prevStep}
            disabled={currentStep === 1 || loading}
            className="px-4 py-2 border border-slate-300 rounded-md shadow-sm text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
          
          {currentStep < 5 ? (
            <button
              type="button"
              onClick={nextStep}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Continue
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Sign and Register'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
