'use client'

import { useState } from 'react'
import { useAuth } from '../providers'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LoginForm() {
  const [isLogin, setIsLogin] = useState(true)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Для демонстрации используем моковые данные
      const mockUser = {
        id: '1',
        name: formData.name || 'Иван Петров',
        email: formData.email,
        role: 'MANAGER',
        avatar: undefined
      }
      const mockToken = 'mock-jwt-token'

      // Имитируем задержку сети
      await new Promise(resolve => setTimeout(resolve, 1000))

      login(mockUser, mockToken)
      toast.success(isLogin ? 'Добро пожаловать!' : 'Регистрация успешна!')
      router.push('/dashboard')
    } catch (error) {
      toast.error('Ошибка соединения с сервером')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg shadow-xl p-8 border border-slate-700">
      <div className="mb-6">
        <div className="flex justify-center mb-4">
          <img 
            src="https://crm.turborand.ru/upload/bitrix24/689/e9u6x6rfh3lqyrgk1eedi388iibwi4sy/logo_SD6gdtDO.png" 
            alt="Task Manager Logo" 
            className="h-16 w-auto"
          />
        </div>
        <h2 className="text-2xl font-bold text-white text-center">
          {isLogin ? 'Вход в систему' : 'Регистрация'}
        </h2>
        <p className="text-slate-300 text-center mt-2">
          {isLogin ? 'Войдите в свой аккаунт' : 'Создайте новый аккаунт'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Имя
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={!isLogin}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Ваше имя"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
            placeholder="your@email.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Пароль
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Подтвердите пароль
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required={!isLogin}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="••••••••"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  )
}
