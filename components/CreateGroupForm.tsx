'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateGroupForm({ userId }: { userId: string }) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return

    const badWordsModule: any = await import('bad-words')
    const FilterClass = badWordsModule.Filter || badWordsModule.default
    const filter = new FilterClass()

    if (filter.isProfane(name)) {
      alert('Please choose an appropriate group name.')
      return
    }

    setLoading(true)

    const { data: group, error } = await supabase
      .from('groups')
      .insert({ name, owner_id: userId })
      .select()
      .single()

    if (error) {
      alert('Error creating group: ' + error.message)
      setLoading(false)
      return
    }

    // Add the creator as a member of their own group
    await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId })

    setLoading(false)
    setName('')
    router.refresh()
  }

  return (
    <form onSubmit={handleCreate}>
      <input
        type="text"
        placeholder="Group name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  )
}