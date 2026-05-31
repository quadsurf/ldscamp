import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { LayoutDashboard, Users, MapPin, Settings, Tent, LogOut } from 'lucide-react'

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { stakeSlug: string }
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/main/camp-director-signup')
  }

  // Fetch the group and profile
  const { data: stake } = await supabase
    .from('stakes')
    .select('id, name, slug, logo_url')
    .eq('slug', params.stakeSlug)
    .single()

  if (!stake) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      phone, 
      entity_id, 
      stake_id,
      profile_roles (
        roles (
          name
        )
      )
    `)
    .eq('id', user.id)
    .single()

  if (!profile) {
    redirect('/')
  }

  const roles = profile.profile_roles?.map((pr: any) => pr.roles.name) || []

  // If a parent signs up via the stake's landing page, their stake_id might be null initially.
  // We can assign them to this stake if they don't have one yet.
  if (!profile.stake_id) {
    await supabase
      .from('profiles')
      .update({ stake_id: stake.id })
      .eq('id', user.id)
    // Update local profile object for the rest of the layout logic
    profile.stake_id = stake.id
  } else if (profile.stake_id !== stake.id) {
    // If they belong to a different stake, don't let them in here
    redirect('/')
  }

  // Parent Onboarding Guard
  // Only redirect if they are not already on the parent-signup page to prevent infinite loops
  const isParentSignupPage = false // We'll handle this in a middleware or page level? No, layout is shared.
  // Actually, wait, if layout wraps `parent-signup/page.tsx`, we can't just redirect unconditionally.
  // Let's use headers() to get the pathname? In Next.js App Router, headers() doesn't give pathname reliably.
  // We should probably check the route? Actually, the layout wraps all dash/ pages.
  // We can just build the parent-signup component inside `dash/parent-signup/page.tsx`.
  // Wait, `layout.tsx` runs for `dash/parent-signup` too. 
  // Let's skip the redirect here and put the redirect in `dash/page.tsx` instead, or do it cleverly.
  // Actually, we can check if it's the parent role, and if they lack phone/entity_id, we render the layout, but when they hit `dash/page.tsx`, we redirect them there.
  // Wait, the plan says: "If a parent logs in but has not yet completed their profile (no phone number), redirect them to /[stakeSlug]/dash/parent-signup"
  
  const isCampDirector = roles.some((r: string) => ['camp_director', 'assistant_camp_director', 'admin', 'super_admin'].includes(r));
  const isParent = roles.includes('parent');

  if (!isCampDirector && !isParent) {
    redirect('/')
  }

  const directorNavigation = [
    { name: 'Dashboard', href: `/${params.stakeSlug}/dash`, icon: LayoutDashboard },
    { name: 'Wards & Branches', href: `/${params.stakeSlug}/dash/wards`, icon: MapPin },
    { name: 'People Directory', href: `/${params.stakeSlug}/dash/people`, icon: Users },
    { name: 'Settings', href: `/${params.stakeSlug}/dash/settings`, icon: Settings },
  ]

  const parentNavigation = [
    { name: 'My Family', href: `/${params.stakeSlug}/dash`, icon: Users },
    { name: 'Register Youth', href: `/${params.stakeSlug}/dash/register-for-camp`, icon: Tent },
  ]

  const navigation = isParent ? parentNavigation : directorNavigation;

  return (
    <div className="flex h-screen bg-slate-50 font-sans">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="h-16 flex items-center px-6 border-b border-slate-200">
          {stake.logo_url ? (
            <img src={stake.logo_url} alt={stake.name} className="h-8 w-auto" />
          ) : (
            <div className="flex items-center text-indigo-600 font-bold text-lg">
              <Tent className="w-6 h-6 mr-2" />
              {stake.name}
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
          <h1 className="text-xl font-semibold text-slate-800">{stake.name} Dashboard</h1>
        </div>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
