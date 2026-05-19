import { createClient } from '@/lib/supabase/server'
import { Users, MapPin, ClipboardList, ShieldCheck } from 'lucide-react'

export default async function DashboardOverview({
  params,
}: {
  params: { groupSlug: string }
}) {
  const supabase = await createClient()

  // First get the group_id from the slug
  const { data: group } = await supabase
    .from('groups')
    .select('id')
    .eq('slug', params.groupSlug)
    .single()

  if (!group) return null

  // Fetch metrics in parallel
  const [
    { count: wardsCount },
    { count: peopleCount },
    { count: formsCount },
  ] = await Promise.all([
    supabase.from('wards').select('*', { count: 'exact', head: true }).eq('group_id', group.id),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('group_id', group.id),
    supabase.from('form_submissions').select('*', { count: 'exact', head: true }).eq('group_id', group.id),
  ])

  const stats = [
    { name: 'Total Wards', value: wardsCount || 0, icon: MapPin, color: 'bg-blue-500' },
    { name: 'Registered People', value: peopleCount || 0, icon: Users, color: 'bg-emerald-500' },
    { name: 'Completed Forms', value: formsCount || 0, icon: ClipboardList, color: 'bg-amber-500' },
    { name: 'Verified Volunteers', value: 0, icon: ShieldCheck, color: 'bg-purple-500' }, // Placeholder for future features
  ]

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Overview</h2>
        <p className="mt-1 text-sm text-slate-500">
          A high-level view of your camp's registration progress.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.name}
            className="bg-white overflow-hidden shadow-sm rounded-xl border border-slate-200 transition-all hover:shadow-md hover:-translate-y-1"
          >
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
                    <dd>
                      <div className="text-2xl font-bold text-slate-900">{stat.value}</div>
                    </dd>
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
            <p>Share your unique registration link with parents: <code className="bg-white px-2 py-1 rounded text-indigo-600 font-mono text-sm ml-1">ldscamp.app/{params.groupSlug}</code></p>
          </li>
        </ul>
      </div>
    </div>
  )
}
