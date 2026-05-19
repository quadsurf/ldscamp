import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, MapPin, Settings, Tent, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { groupSlug: string }
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/main/camp-director-signup')
  }

  // Fetch the group and profile
  const { data: group } = await supabase
    .from('groups')
    .select('id, name, slug, logo_url')
    .eq('slug', params.groupSlug)
    .single()

  if (!group) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .eq('group_id', group.id)
    .single()

  if (!profile || !['camp_director', 'assistant_camp_director', 'admin', 'super_admin'].includes(profile.role)) {
    // User does not have access to this dashboard
    redirect('/')
  }

  const navigation = [
    { name: 'Dashboard', href: `/${params.groupSlug}/dash`, icon: LayoutDashboard },
    { name: 'Wards & Branches', href: `/${params.groupSlug}/dash/wards`, icon: MapPin },
    { name: 'People Directory', href: `/${params.groupSlug}/dash/people`, icon: Users },
    { name: 'Settings', href: `/${params.groupSlug}/dash/settings`, icon: Settings },
  ]

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          {group.logo_url ? (
            <img src={group.logo_url} alt={group.name} className="h-8 w-auto" />
          ) : (
            <div className="flex items-center text-indigo-600 font-bold text-lg">
              <Tent className="w-6 h-6 mr-2" />
              {group.name}
            </div>
          )}
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
          {navigation.map((item) => {
            return (
              <Link
                key={item.name}
                href={item.href}
                className="group flex items-center px-2 py-2.5 text-sm font-medium rounded-md text-slate-700 hover:bg-indigo-50 hover:text-indigo-600 transition-colors"
              >
                <item.icon className="mr-3 h-5 w-5 text-slate-400 group-hover:text-indigo-600" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <form action="/auth/signout" method="POST">
            <button
              type="submit"
              className="group flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <LogOut className="mr-3 h-5 w-5 text-slate-400 group-hover:text-red-600" />
              Sign Out
            </button>
          </form>
        </div>
      </div>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="h-16 bg-white border-b border-slate-200 flex items-center px-8 shadow-sm">
          <h1 className="text-xl font-semibold text-slate-800">{group.name} Dashboard</h1>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
