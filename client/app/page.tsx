'use client'

import { useAuth } from './providers'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import LoginForm from './components/LoginForm'
import Dashboard from './components/Dashboard'

export default function Home() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (user) {
    return <Dashboard />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Task Manager Pro
          </h1>
          <p className="text-slate-300">
            Современное управление задачами для вашей команды
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  )
}
