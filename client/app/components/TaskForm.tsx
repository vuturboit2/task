'use client'

import { useState } from 'react'
import { X, Calendar, User, Eye } from 'lucide-react'
import toast from 'react-hot-toast'

interface TaskFormProps {
  onClose: () => void
  onTaskCreate: (task: any) => void
}

export default function TaskForm({ onClose, onTaskCreate }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIUM',
    dueDate: '',
    assigneeId: '',
    watcherIds: [] as string[]
  })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        const data = await response.json()
        onTaskCreate(data.task)
        toast.success('Задача создана!')
        onClose()
      } else {
        const error = await response.json()
        toast.error(error.message || 'Ошибка создания задачи')
      }
    } catch (error) {
      toast.error('Ошибка соединения с сервером')
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
          <h2 className="text-xl font-semibold text-white">Создать задачу</h2>
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
              Название задачи *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Введите название задачи"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Описание
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
              placeholder="Опишите задачу подробнее"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Приоритет
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
              >
                <option value="LOW">Низкий</option>
                <option value="MEDIUM">Средний</option>
                <option value="HIGH">Высокий</option>
                <option value="URGENT">Срочный</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Срок выполнения
              </label>
              <div className="relative">
                <input
                  type="datetime-local"
                  name="dueDate"
                  value={formData.dueDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                />
                <Calendar className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Назначить на
            </label>
            <div className="relative">
              <input
                type="text"
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                placeholder="ID пользователя (пока в разработке)"
              />
              <User className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Наблюдатели
            </label>
            <div className="relative">
              <input
                type="text"
                value={formData.watcherIds.join(', ')}
                onChange={(e) => setFormData({
                  ...formData,
                  watcherIds: e.target.value.split(',').map(id => id.trim()).filter(Boolean)
                })}
                className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white placeholder-slate-400"
                placeholder="ID пользователей через запятую (пока в разработке)"
              />
              <Eye className="absolute right-3 top-2.5 w-4 h-4 text-slate-400" />
            </div>
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
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Создание...' : 'Создать задачу'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
