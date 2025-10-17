'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, User, Eye, MoreVertical, Edit, Trash2, ExternalLink } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
  creator: {
    id: string
    name: string
    avatar?: string
  }
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  watchers: Array<{
    id: string
    name: string
    avatar?: string
  }>
}

interface TaskListProps {
  tasks: Task[]
  onUpdate: (task: Task) => void
  onDelete: (taskId: string) => void
  showCreateButton?: boolean
  onCreateTask?: () => void
}

export default function TaskList({ tasks, onUpdate, onDelete, showCreateButton, onCreateTask }: TaskListProps) {
  const [filter, setFilter] = useState('all')
  const [sortBy, setSortBy] = useState('createdAt')
  const router = useRouter()

  const getStatusColor = (status: string) => {
    const colors = {
      TODO: 'bg-gray-100 text-gray-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      IN_REVIEW: 'bg-purple-100 text-purple-800',
      DONE: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'border-l-green-500',
      MEDIUM: 'border-l-yellow-500',
      HIGH: 'border-l-orange-500',
      URGENT: 'border-l-red-500'
    }
    return colors[priority as keyof typeof colors] || 'border-l-gray-500'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      TODO: 'К выполнению',
      IN_PROGRESS: 'В работе',
      IN_REVIEW: 'На проверке',
      DONE: 'Выполнено',
      CANCELLED: 'Отменено'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getPriorityLabel = (priority: string) => {
    const labels = {
      LOW: 'Низкий',
      MEDIUM: 'Средний',
      HIGH: 'Высокий',
      URGENT: 'Срочный'
    }
    return labels[priority as keyof typeof labels] || priority
  }

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true
    if (filter === 'my') return task.assignee?.id === localStorage.getItem('userId')
    return task.status === filter
  })

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    if (sortBy === 'createdAt') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    }
    if (sortBy === 'priority') {
      const priorityOrder = { URGENT: 4, HIGH: 3, MEDIUM: 2, LOW: 1 }
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
    }
    return 0
  })

  return (
    <div className="bg-slate-800 rounded-lg shadow">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-white">Задачи</h2>
          {showCreateButton && onCreateTask && (
            <button
              onClick={onCreateTask}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
            >
              <span>Создать задачу</span>
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-4">
          <div className="flex space-x-2">
            {['all', 'my', 'TODO', 'IN_PROGRESS', 'DONE'].map((filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-3 py-1 rounded-full text-sm ${
                  filter === filterOption
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                }`}
              >
                {filterOption === 'all' ? 'Все' : 
                 filterOption === 'my' ? 'Мои' : 
                 getStatusLabel(filterOption)}
              </button>
            ))}
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-1 bg-slate-700 border border-slate-600 rounded-lg text-sm text-white"
          >
            <option value="createdAt">По дате создания</option>
            <option value="dueDate">По сроку</option>
            <option value="priority">По приоритету</option>
          </select>
        </div>
      </div>

      <div className="divide-y divide-slate-700 custom-scrollbar">
        {sortedTasks.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p>Задач не найдено</p>
          </div>
        ) : (
          sortedTasks.map((task) => (
            <div
              key={task.id}
              className={`p-6 hover:bg-slate-700/50 transition-colors border-l-4 ${getPriorityColor(task.priority)} cursor-pointer`}
              onClick={() => router.push(`/task/${task.id}`)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-medium text-white">{task.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                      {getStatusLabel(task.status)}
                    </span>
                    <span className="text-xs text-slate-400">
                      {getPriorityLabel(task.priority)}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-slate-300 mb-3">{task.description}</p>
                  )}

                  <div className="flex items-center space-x-6 text-sm text-slate-400">
                    {task.dueDate && (
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: ru })}
                        </span>
                      </div>
                    )}

                    {task.assignee && (
                      <div className="flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Назначено: {task.assignee.name}</span>
                      </div>
                    )}

                    {task.watchers.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{task.watchers.length} наблюдателей</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
                  <button 
                    onClick={() => router.push(`/task/${task.id}`)}
                    className="p-1 text-slate-400 hover:text-blue-400"
                    title="Открыть детали"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-300">
                    <Edit className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => onDelete(task.id)}
                    className="p-1 text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button className="p-1 text-slate-400 hover:text-slate-300">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
