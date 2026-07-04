'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LinkAccountForm({ userId }: { userId: string }) {
  const [platform, setPlatform] = useState('steam')
  const [username, setUsername] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleLink = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim()) return
    setLoading(true)

    const { error } = await supabase
      .from('game_accounts')
      .insert({
        user_id: userId,
        platform,
        platform_username: username.trim(),
      })

    if (error) {
      alert('Error linking account: ' + error.message)
      setLoading(false)
      return
    }

    setLoading(false)
    setUsername('')
    router.refresh()
  }

  return (
    <form onSubmit={handleLink}>
      <select value={platform} onChange={(e) => setPlatform(e.target.value)}>
        <option value="steam">Steam</option>
        <option value="epic">Epic</option>
        <option value="psn">PlayStation</option>
        <option value="xbox">Xbox</option>
      </select>
      <input
        type="text"
        placeholder="Your platform username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <button type="submit" disabled={loading}>
        {loading ? 'Linking...' : 'Link Account'}
      </button>
    </form>
  )
}