'use client'

import { useState } from 'react'
import { X, User, Mail, Phone, Calendar, Shield, Save } from 'lucide-react'

interface Member {
  id: string
  name: string
  email: string
  role: string
  position: string
  status: string
  phone: string
  department: string
  skills: string[]
  bio: string
}

interface EditMemberFormProps {
  member: Member
  onClose: () => void
  onSave: (member: Member) => void
}

export default function EditMemberForm({ member, onClose, onSave }: EditMemberFormProps) {
  const [formData, setFormData] = useState({
    name: member.name,
    email: member.email,
    role: member.role,
    position: member.position,
    status: member.status,
    phone: member.phone,
    department: member.department,
    skills: member.skills.join(', '),
    bio: member.bio
  })

  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Здесь будет API вызов для сохранения изменений
      await new Promise(resolve => setTimeout(resolve, 1000)) // Имитация API вызова
      
      const updatedMember = {
        ...member,
        ...formData,
        skills: formData.skills.split(',').map(skill => skill.trim()).filter(Boolean)
      }
      
      onSave(updatedMember)
      onClose()
    } catch (error) {
      console.error('Ошибка сохранения:', error)
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
      <div className="bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <h2 className="text-xl font-semibold text-white">Редактировать участника</h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-300 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Основная информация */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Имя и фамилия *
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                  placeholder="Введите имя и фамилию"
                />
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                  placeholder="email@company.com"
                />
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Должность *
              </label>
              <input
                type="text"
                name="position"
                value={formData.position}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                placeholder="Введите должность"
              />
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
                placeholder="Введите отдел"
              />
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
                Статус *
              </label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="ACTIVE">Активен</option>
                <option value="AWAY">Отсутствует</option>
                <option value="INACTIVE">Неактивен</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Телефон
            </label>
            <div className="relative">
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                placeholder="+7 (999) 123-45-67"
              />
              <Phone className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Навыки
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Навыки через запятую"
            />
            <p className="text-slate-400 text-xs mt-1">Укажите навыки через запятую</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Биография
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Краткая биография участника"
            />
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
              <Save className="w-4 h-4" />
              <span>{loading ? 'Сохранение...' : 'Сохранить'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
