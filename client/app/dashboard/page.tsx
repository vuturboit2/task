'use client'

import { useAuth } from '../providers'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import Dashboard from '../components/Dashboard'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) {
      router.push('/')
    }
  }, [user, router])

  if (!user) {
    return <div>Загрузка...</div>
  }

  return <Dashboard />
}
