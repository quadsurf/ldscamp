import { createClient } from '@/lib/supabase/server'
import { Users, MapPin, ClipboardList, ShieldCheck, Tent, Plus } from 'lucide-react'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function DashboardOverview({
  params,
}: {
  params: { stakeSlug: string }
}) {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  // First get the stake_id from the slug
  const { data: stake } = await supabase
    .from('stakes')
    .select('id')
    .eq('slug', params.stakeSlug)
    .single()

  if (!stake) return null

  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      profile_roles (
        roles (
          name
        )
      )
    `)
    .eq('id', user.id)
    .eq('stake_id', stake.id)
    .single()

  if (!profile) redirect('/')

  const roles = profile.profile_roles?.map((pr: any) => pr.roles.name) || []

  // Parent Onboarding Guard
  if (roles.includes('parent') && (!profile.phone || !profile.entity_id)) {
    redirect(`/${params.stakeSlug}/dash/parent-signup`)
  }

  // --- DIRECTOR DASHBOARD ---
  if (roles.some((r: string) => ['camp_director', 'assistant_camp_director', 'admin', 'super_admin'].includes(r))) {
    const [
      { count: wardsCount },
      { count: peopleCount },
      { count: attendeesCount },
    ] = await Promise.all([
      supabase.from('entities').select('*', { count: 'exact', head: true }).eq('stake_id', stake.id),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('stake_id', stake.id),
      supabase.from('camp_attendees').select('*', { count: 'exact', head: true }).eq('stake_id', stake.id),
    ])

    const stats = [
      { name: 'Total Entities (Wards)', value: wardsCount || 0, icon: MapPin, color: 'bg-blue-500' },
      { name: 'Registered People', value: peopleCount || 0, icon: Users, color: 'bg-emerald-500' },
      { name: 'Camp Attendees', value: attendeesCount || 0, icon: ClipboardList, color: 'bg-amber-500' },
      { name: 'Verified Volunteers', value: 0, icon: ShieldCheck, color: 'bg-purple-500' },
    ]

    return (
      <div className="space-y-6 max-w-6xl mx-auto">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
          <p className="mt-1 text-sm text-slate-500">A high-level view of your camp's registration progress.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.name} className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 transition-all hover:shadow-md hover:-translate-y-1">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-lg ${stat.color} bg-opacity-10`}>
                      <stat.icon className={`h-6 w-6 ${stat.color.replace('bg-', 'text-')}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-slate-500 truncate">{stat.name}</dt>
                      <dd><div className="text-2xl font-bold text-slate-900">{stat.value}</div></dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 bg-indigo-50 border border-indigo-100 rounded-xl p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-indigo-900">Next Steps for Camp Directors</h3>
          <ul className="mt-4 space-y-3 text-indigo-800">
            <li className="flex items-start">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-sm font-bold mr-3 flex-shrink-0">1</span>
              <p>Go to <strong>Wards & Branches</strong> to setup the wards in your stake. Parents will need to select their ward when registering.</p>
            </li>
            <li className="flex items-start">
              <span className="flex items-center justify-center h-6 w-6 rounded-full bg-indigo-200 text-sm font-bold mr-3 flex-shrink-0">2</span>
              <p>Share your unique registration link with parents: <code className="bg-white px-2 py-1 rounded text-indigo-600 font-mono text-sm ml-1">ldscamp.app/{params.stakeSlug}</code></p>
            </li>
          </ul>
        </div>
      </div>
    )
  }

  // --- PARENT DASHBOARD ---
  const { data: attendees } = await supabase
    .from('camp_attendees')
    .select('*')
    .eq('parent_id', user.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-slate-200 pb-5">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">My Family</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your registered teenagers for this upcoming camp.</p>
        </div>
        <Link 
          href={`/${params.stakeSlug}/dash/register-for-camp`}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
        >
          <Plus className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
          Register Youth
        </Link>
      </div>

      {(!attendees || attendees.length === 0) ? (
        <div className="text-center bg-white rounded-xl border border-dashed border-slate-300 p-12">
          <Tent className="mx-auto h-12 w-12 text-slate-300" />
          <h3 className="mt-2 text-sm font-semibold text-slate-900">No youth registered</h3>
          <p className="mt-1 text-sm text-slate-500">Get started by registering a teenager for camp.</p>
          <div className="mt-6">
            <Link
              href={`/${params.stakeSlug}/dash/register-for-camp`}
              className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              <Plus className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
              Register Youth
            </Link>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-sm rounded-xl border border-slate-200 overflow-hidden">
          <ul role="list" className="divide-y divide-slate-200">
            {attendees.map((attendee) => (
              <li key={attendee.id} className="p-4 sm:p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col">
                    <p className="text-sm font-semibold text-indigo-600 truncate">
                      {attendee.registration_data.firstName} {attendee.registration_data.lastName}
                    </p>
                    <p className="mt-1 flex text-xs text-slate-500">
                      Public Link: <a href={`/${params.stakeSlug}/${attendee.slug}`} target="_blank" rel="noreferrer" className="ml-1 text-indigo-500 hover:underline">ldscamp.app/{params.stakeSlug}/{attendee.slug}</a>
                    </p>
                  </div>
                  <div className="ml-2 flex-shrink-0 flex">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-emerald-100 text-emerald-800">
                      Registered
                    </span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
