'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function JoinGroupForm({ userId }: { userId: string }) {
  const [code, setCode] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)

    const { data: group, error: findError } = await supabase
      .from('groups')
      .select('id')
      .eq('invite_code', code.trim())
      .single()

    if (findError || !group) {
      alert('No group found with that invite code.')
      setLoading(false)
      return
    }

    const { error: joinError } = await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId })

    if (joinError) {
      alert('Error joining group: ' + joinError.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setCode('')
    router.refresh()
  }

  return (
    <form onSubmit={handleJoin}>
      <input
        type="text"
        placeholder="Invite code"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Joining...' : 'Join Group'}
      </button>
    </form>
  )
}