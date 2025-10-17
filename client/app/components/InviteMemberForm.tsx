'use client'

import { useState } from 'react'
import { X, Mail, User, Shield, Send } from 'lucide-react'

interface InviteMemberFormProps {
  onClose: () => void
  onInvite: (invitation: any) => void
}

export default function InviteMemberForm({ onClose, onInvite }: InviteMemberFormProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'MEMBER',
    position: '',
    department: '',
    message: ''
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Здесь будет API вызов для отправки приглашения
      await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация API вызова
      
      onInvite(formData)
      onClose()
    } catch (error) {
      console.error('Ошибка отправки приглашения:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Пригласить участника</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-300 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Email адрес *
            </label>
            <div className="relative">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                placeholder="colleague@company.com"
              />
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Имя (необязательно)
            </label>
            <div className="relative">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                placeholder="Имя и фамилия"
              />
              <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Роль *
              </label>
              <div className="relative">
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                >
                  <option value="MEMBER">Участник</option>
                  <option value="MANAGER">Менеджер</option>
                  <option value="ADMIN">Администратор</option>
                </select>
                <Shield className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Должность
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                placeholder="Должность"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Отдел
            </label>
            <input
              type="text"
              name="department"
              value={formData.department}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Отдел"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Персональное сообщение
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Добавьте персональное сообщение к приглашению..."
            />
          </div>

          <div className="bg-slate-700 rounded-lg p-4">
            <h4 className="text-white font-medium mb-2">Что получит участник:</h4>
            <ul className="text-slate-300 text-sm space-y-1">
              <li>• Доступ к проектам и задачам</li>
              <li>• Возможность создавать и управлять задачами</li>
              <li>• Уведомления о важных событиях</li>
              <li>• Доступ к командным чатам и обсуждениям</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>{loading ? 'Отправка...' : 'Отправить приглашение'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
