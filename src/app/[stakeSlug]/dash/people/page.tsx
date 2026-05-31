'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Loader2, Search, Filter, Shield, User, Phone, MapPin } from 'lucide-react'

type ProfileWithWard = {
  id: string
  first_name: string | null
  last_name: string | null
  phone: string | null
  roles: string[]
  created_at: string
  wards: {
    name: string
    entity_type: string
  } | null
}

export default function PeopleViewerPage({
  params,
}: {
  params: { stakeSlug: string }
}) {
  const supabase = createClient()
  
  const [people, setPeople] = useState<ProfileWithWard[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')

  useEffect(() => {
    async function loadData() {
      // Get group ID
      const { data: stake } = await supabase
        .from('stakes')
        .select('id')
        .eq('slug', params.stakeSlug)
        .single()
        
      if (stake) {
        // Fetch profiles with joined ward data
        const { data: profilesData } = await supabase
          .from('profiles')
          .select(`
            *,
            entities (
              name,
              entity_type
            ),
            profile_roles (
              roles (
                name
              )
            )
          `)
          .eq('stake_id', stake.id)
          .order('created_at', { ascending: false })
          
        if (profilesData) {
          const mapped = profilesData.map((p: any) => ({
            ...p,
            wards: p.entities,
            roles: p.profile_roles?.map((pr: any) => pr.roles.name) || []
          }))
          setPeople(mapped as ProfileWithWard[])
        }
      }
      setIsLoading(false)
    }
    
    loadData()
  }, [params.stakeSlug, supabase])

  // Filter logic
  const filteredPeople = people.filter(person => {
    const matchesSearch = 
      `${person.first_name || ''} ${person.last_name || ''}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (person.phone && person.phone.includes(searchQuery))
      
    const matchesRole = roleFilter === 'all' || person.roles.includes(roleFilter)
    
    return matchesSearch && matchesRole
  })

  // Format role for display
  const formatRole = (role: string) => {
    return role.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  const getRoleBadgeColor = (roles: string[]) => {
    if (roles.some(r => r.includes('admin') || r.includes('director'))) return 'bg-indigo-100 text-indigo-800 border-indigo-200'
    if (roles.includes('youth')) return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    return 'bg-slate-100 text-slate-800 border-slate-200'
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">People Directory</h2>
          <p className="mt-1 text-sm text-slate-500">
            View everyone registered for your camp.
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800">
            Total: {people.length}
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-6 bg-white p-4 border border-slate-200 rounded-xl shadow-sm flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        
        <div className="relative min-w-[200px]">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Filter className="h-4 w-4 text-slate-400" />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm appearance-none bg-white"
          >
            <option value="all">All Roles</option>
            <option value="parent">Parent</option>
            <option value="youth">Youth</option>
            <option value="ward_camp_director">Ward Camp Director</option>
            <option value="camp_director">Camp Director</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="mt-6 bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Role
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Unit (Ward/Branch)
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Registered On
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <Loader2 className="mx-auto h-8 w-8 animate-spin text-indigo-500" />
                    <p className="mt-2 text-sm">Loading people...</p>
                  </td>
                </tr>
              ) : filteredPeople.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                    <User className="mx-auto h-10 w-10 text-slate-300 mb-2" />
                    <p>No people found matching your criteria.</p>
                  </td>
                </tr>
              ) : (
                filteredPeople.map((person) => (
                  <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                          {(person.first_name?.[0] || '') + (person.last_name?.[0] || '') || '?'}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {person.first_name} {person.last_name}
                          </div>
                          {!person.first_name && !person.last_name && (
                            <div className="text-sm italic text-slate-400">Unnamed User</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-wrap gap-1">
                        {person.roles.map(r => (
                          <span key={r} className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor([r])}`}>
                            {r.includes('director') || r.includes('admin') ? (
                              <Shield className="w-3 h-3 mr-1" />
                            ) : null}
                            {formatRole(r)}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 flex items-center">
                        {person.wards ? (
                          <>
                            <MapPin className="w-4 h-4 text-slate-400 mr-1.5" />
                            {person.wards.name} {person.wards.entity_type}
                          </>
                        ) : (
                          <span className="text-slate-400 italic">Unassigned</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-900 flex items-center">
                        {person.phone ? (
                          <>
                            <Phone className="w-4 h-4 text-slate-400 mr-1.5" />
                            {person.phone}
                          </>
                        ) : (
                          <span className="text-slate-400 italic">No phone</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-slate-500">
                      {new Date(person.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
