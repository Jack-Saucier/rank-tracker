'use client'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function CreateGroupForm({ userId }: { userId: string }) {
  const [name, setName] = useState('')
  const [isPublic, setIsPublic] = useState(false)
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
      .insert({ name, owner_id: userId, is_public: isPublic })
      .select()
      .single()

    if (error) {
      alert('Error creating group: ' + error.message)
      setLoading(false)
      return
    }

    await supabase
      .from('group_members')
      .insert({ group_id: group.id, user_id: userId })

    setLoading(false)
    setName('')
    setIsPublic(false)
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
      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '8px' }}>
        <input
          type="checkbox"
          checked={isPublic}
          onChange={(e) => setIsPublic(e.target.checked)}
        />
        Make this group publicly searchable
      </label>
      <button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create Group'}
      </button>
    </form>
  )
}