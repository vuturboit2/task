'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Bell, 
  Check, 
  X, 
  Clock, 
  AlertCircle,
  CheckCircle,
  User,
  Calendar,
  Filter,
  Search,
  CheckCheck,
  Trash2
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

// Моковые данные для всех уведомлений
const mockNotifications = [
  {
    id: '1',
    type: 'task_completed',
    title: 'Задача выполнена',
    message: 'Анна Смирнова завершила задачу "Обновить дизайн сайта"',
    time: '2024-11-25T14:30:00Z',
    read: false,
    priority: 'high',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    project: 'Обновление веб-сайта',
    assignee: 'Анна Смирнова'
  },
  {
    id: '2',
    type: 'task_overdue',
    title: 'Задача просрочена',
    message: 'Задача "Подготовить отчет" просрочена на 1 день',
    time: '2024-11-25T13:15:00Z',
    read: false,
    priority: 'urgent',
    icon: AlertCircle,
    color: 'text-red-500',
    bgColor: 'bg-red-100',
    project: 'Квартальный отчет',
    assignee: 'Мария Козлова'
  },
  {
    id: '3',
    type: 'project_update',
    title: 'Обновление проекта',
    message: 'В проекте "Мобильное приложение" добавлена новая задача',
    time: '2024-11-25T10:45:00Z',
    read: true,
    priority: 'medium',
    icon: Clock,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    project: 'Мобильное приложение',
    assignee: 'Иван Петров'
  },
  {
    id: '4',
    type: 'team_invite',
    title: 'Новый участник',
    message: 'Мария Козлова присоединилась к команде',
    time: '2024-11-24T16:20:00Z',
    read: true,
    priority: 'low',
    icon: User,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    project: 'Команда',
    assignee: 'Мария Козлова'
  },
  {
    id: '5',
    type: 'task_assigned',
    title: 'Новая задача',
    message: 'Вам назначена задача "Тестирование API"',
    time: '2024-11-24T14:10:00Z',
    read: true,
    priority: 'medium',
    icon: CheckCircle,
    color: 'text-blue-500',
    bgColor: 'bg-blue-100',
    project: 'Мобильное приложение',
    assignee: 'Петр Иванов'
  },
  {
    id: '6',
    type: 'deadline_reminder',
    title: 'Напоминание о дедлайне',
    message: 'До дедлайна задачи "Интеграция с базой данных" осталось 2 дня',
    time: '2024-11-24T09:30:00Z',
    read: true,
    priority: 'high',
    icon: Clock,
    color: 'text-orange-500',
    bgColor: 'bg-orange-100',
    project: 'Мобильное приложение',
    assignee: 'Петр Иванов'
  },
  {
    id: '7',
    type: 'comment_added',
    title: 'Новый комментарий',
    message: 'Иван Петров добавил комментарий к задаче "Создание макетов"',
    time: '2024-11-23T15:45:00Z',
    read: true,
    priority: 'low',
    icon: CheckCircle,
    color: 'text-purple-500',
    bgColor: 'bg-purple-100',
    project: 'Обновление веб-сайта',
    assignee: 'Анна Смирнова'
  },
  {
    id: '8',
    type: 'project_completed',
    title: 'Проект завершен',
    message: 'Проект "Внедрение CRM системы" успешно завершен',
    time: '2024-11-23T11:20:00Z',
    read: true,
    priority: 'high',
    icon: CheckCircle,
    color: 'text-green-500',
    bgColor: 'bg-green-100',
    project: 'CRM система',
    assignee: 'Иван Петров'
  }
]

const notificationTypes = [
  { id: 'all', name: 'Все', count: mockNotifications.length },
  { id: 'unread', name: 'Непрочитанные', count: mockNotifications.filter(n => !n.read).length },
  { id: 'task_completed', name: 'Задачи выполнены', count: mockNotifications.filter(n => n.type === 'task_completed').length },
  { id: 'task_overdue', name: 'Просроченные', count: mockNotifications.filter(n => n.type === 'task_overdue').length },
  { id: 'project_update', name: 'Обновления проектов', count: mockNotifications.filter(n => n.type === 'project_update').length },
  { id: 'team_invite', name: 'Команда', count: mockNotifications.filter(n => n.type === 'team_invite').length }
]

const priorityColors = {
  urgent: 'border-l-red-500',
  high: 'border-l-orange-500',
  medium: 'border-l-blue-500',
  low: 'border-l-gray-500'
}

export default function NotificationsPage() {
  const router = useRouter()
  const [notifications, setNotifications] = useState(mockNotifications)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = filter === 'all' || 
                         (filter === 'unread' && !notification.read) ||
                         notification.type === filter
    const matchesSearch = notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         notification.project.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const sortedNotifications = [...filteredNotifications].sort((a, b) => {
    if (sortBy === 'newest') {
      return new Date(b.time).getTime() - new Date(a.time).getTime()
    } else if (sortBy === 'oldest') {
      return new Date(a.time).getTime() - new Date(b.time).getTime()
    } else if (sortBy === 'priority') {
      const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 }
      return priorityOrder[b.priority as keyof typeof priorityOrder] - priorityOrder[a.priority as keyof typeof priorityOrder]
    }
    return 0
  })

  const unreadCount = notifications.filter(n => !n.read).length

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    )
  }

  const deleteNotification = (notificationId: string) => {
    setNotifications(prev => 
      prev.filter(n => n.id !== notificationId)
    )
  }

  const getPriorityLabel = (priority: string) => {
    const labels = {
      urgent: 'Срочно',
      high: 'Высокий',
      medium: 'Средний',
      low: 'Низкий'
    }
    return labels[priority as keyof typeof labels] || priority
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Левая боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Уведомления</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Назад к дашборду
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Всего:</span>
                  <span className="text-white">{notifications.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Непрочитанных:</span>
                  <span className="text-white">{unreadCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Сегодня:</span>
                  <span className="text-white">
                    {notifications.filter(n => 
                      new Date(n.time).toDateString() === new Date().toDateString()
                    ).length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col">
          {/* Заголовок */}
          <header className="bg-slate-800 shadow-sm border-b border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Уведомления</h1>
                <p className="text-slate-400">Все уведомления и события</p>
              </div>
              <div className="flex items-center space-x-3">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition-colors"
                    title="Отметить все как прочитанные"
                  >
                    <CheckCheck className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </header>

          {/* Фильтры и поиск */}
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск уведомлений..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {notificationTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} ({type.count})
                  </option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">Сначала новые</option>
                <option value="oldest">Сначала старые</option>
                <option value="priority">По приоритету</option>
              </select>
            </div>
          </div>

          {/* Список уведомлений */}
          <main className="flex-1 p-6 custom-scrollbar">
            {sortedNotifications.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-slate-500 mb-4">
                  <Bell className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Уведомления не найдены</h3>
                <p className="text-slate-500">Попробуйте изменить фильтры или поисковый запрос</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sortedNotifications.map((notification) => {
                  const Icon = notification.icon
                  return (
                    <div
                      key={notification.id}
                      className={`bg-slate-800 rounded-lg p-6 border-l-4 ${priorityColors[notification.priority as keyof typeof priorityColors]} ${
                        !notification.read ? 'bg-slate-700/30' : ''
                      }`}
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`p-3 rounded-full ${notification.bgColor} ${notification.color}`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-2">
                                <h3 className="text-white font-medium">{notification.title}</h3>
                                {!notification.read && (
                                  <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                                )}
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  notification.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                                  notification.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                                  notification.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-800'
                                }`}>
                                  {getPriorityLabel(notification.priority)}
                                </span>
                              </div>
                              
                              <p className="text-slate-300 mb-3">{notification.message}</p>
                              
                              <div className="flex items-center space-x-4 text-sm text-slate-400">
                                <div className="flex items-center space-x-1">
                                  <Calendar className="w-4 h-4" />
                                  <span>{format(new Date(notification.time), 'dd MMM yyyy, HH:mm', { locale: ru })}</span>
                                </div>
                                <div className="flex items-center space-x-1">
                                  <span>Проект: {notification.project}</span>
                                </div>
                                {notification.assignee && (
                                  <div className="flex items-center space-x-1">
                                    <User className="w-4 h-4" />
                                    <span>{notification.assignee}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2 ml-4">
                              {!notification.read && (
                                <button
                                  onClick={() => markAsRead(notification.id)}
                                  className="p-2 text-slate-400 hover:text-green-400 transition-colors"
                                  title="Отметить как прочитанное"
                                >
                                  <Check className="w-4 h-4" />
                                </button>
                              )}
                              <button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-2 text-slate-400 hover:text-red-400 transition-colors"
                                title="Удалить уведомление"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
