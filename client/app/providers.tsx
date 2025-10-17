'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client'

interface User {
  id: string
  name: string
  email: string
  role: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  token: string | null
  login: (user: User, token: string) => void
  logout: () => void
  socket: Socket | null
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function Providers({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [socket, setSocket] = useState<Socket | null>(null)

  useEffect(() => {
    // Проверяем токен в localStorage при загрузке
    const storedToken = localStorage.getItem('token')
    const storedUser = localStorage.getItem('user')
    
    if (storedToken && storedUser) {
      setToken(storedToken)
      setUser(JSON.parse(storedUser))
      
      // Подключаемся к Socket.io
      const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
        auth: {
          token: storedToken
        }
      })
      
      setSocket(newSocket)
    }
  }, [])

  const login = (userData: User, userToken: string) => {
    setUser(userData)
    setToken(userToken)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', userToken)
    
    // Подключаемся к Socket.io
    const newSocket = io(process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5000', {
      auth: {
        token: userToken
      }
    })
    
    setSocket(newSocket)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    
    if (socket) {
      socket.disconnect()
      setSocket(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout, socket }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within a Providers')
  }
  return context
}
