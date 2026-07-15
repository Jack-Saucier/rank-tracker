'use client'
import { createClient } from '@/lib/supabase/client'
import { useState } from 'react'

type GroupResult = {
  id: string
  name: string
  group_members: { count: number }[]
}

export default function GroupSearch({ userId }: { userId: string }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<GroupResult[]>([])
  const [loading, setLoading] = useState(false)
  const [joiningId, setJoiningId] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSearch(value: string) {
    setQuery(value)
    if (value.trim().length === 0) {
      setResults([])
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('groups')
      .select('id, name, group_members(count)')
      .eq('is_public', true)
      .ilike('name', `%${value}%`)
      .limit(20)

    if (!error && data) setResults(data as unknown as GroupResult[])
    setLoading(false)
  }

  async function handleJoin(groupId: string) {
    setJoiningId(groupId)
    const { error } = await supabase
      .from('group_members')
      .insert({ group_id: groupId, user_id: userId })

    setJoiningId(null)
    if (error) {
      alert('Error joining group: ' + error.message)
      return
    }
    setResults((prev) => prev.filter((g) => g.id !== groupId))
    window.location.reload()
  }

  return (
    <div style={{ maxWidth: '480px' }}>
      <input
        type="text"
        placeholder="Search public groups..."
        value={query}
        onChange={(e) => handleSearch(e.target.value)}
        style={{
          width: '100%',
          padding: '10px 14px',
          borderRadius: '8px',
          border: '1px solid #333',
          background: '#0A0E23',
          color: '#e5e7eb',
        }}
      />

      {loading && <p style={{ opacity: 0.6, marginTop: '8px' }}>Searching...</p>}

      {!loading && query.trim().length > 0 && results.length === 0 && (
        <p style={{ opacity: 0.6, marginTop: '8px' }}>No public groups found.</p>
      )}

      <ul style={{ marginTop: '12px', listStyle: 'none', padding: 0 }}>
        {results.map((group) => {
          const memberCount = group.group_members?.[0]?.count ?? 0
          return (
            <li
              key={group.id}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                background: 'rgba(255,255,255,0.05)',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div>{group.name}</div>
                <div style={{ fontSize: '13px', opacity: 0.6 }}>
                  {memberCount} {memberCount === 1 ? 'member' : 'members'}
                </div>
              </div>
              <button
                onClick={() => handleJoin(group.id)}
                disabled={joiningId === group.id}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#FF3B5C',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {joiningId === group.id ? 'Joining...' : 'Join'}
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}