'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, Search, Filter, Grid, List, Calendar, Users, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuth } from '../providers'

// Моковые данные для проектов
const mockProjects = [
  {
    id: '1',
    name: 'Разработка мобильного приложения',
    description: 'Создание кроссплатформенного мобильного приложения для управления задачами',
    status: 'ACTIVE',
    progress: 65,
    startDate: '2024-11-01',
    endDate: '2024-12-31',
    team: [
      { id: '1', name: 'Иван Петров', role: 'Project Manager', avatar: undefined },
      { id: '2', name: 'Анна Смирнова', role: 'Frontend Developer', avatar: undefined },
      { id: '3', name: 'Петр Иванов', role: 'Backend Developer', avatar: undefined }
    ],
    tasks: {
      total: 24,
      completed: 16,
      inProgress: 6,
      overdue: 2
    },
    priority: 'HIGH',
    color: 'blue'
  },
  {
    id: '2',
    name: 'Обновление веб-сайта',
    description: 'Модернизация корпоративного веб-сайта с новым дизайном',
    status: 'ACTIVE',
    progress: 30,
    startDate: '2024-12-01',
    endDate: '2025-02-28',
    team: [
      { id: '2', name: 'Анна Смирнова', role: 'Lead Designer', avatar: undefined },
      { id: '4', name: 'Мария Козлова', role: 'UI/UX Designer', avatar: undefined }
    ],
    tasks: {
      total: 18,
      completed: 5,
      inProgress: 8,
      overdue: 1
    },
    priority: 'MEDIUM',
    color: 'green'
  },
  {
    id: '3',
    name: 'Внедрение CRM системы',
    description: 'Интеграция и настройка новой CRM системы для отдела продаж',
    status: 'ON_HOLD',
    progress: 15,
    startDate: '2024-10-15',
    endDate: '2025-01-15',
    team: [
      { id: '3', name: 'Петр Иванов', role: 'System Administrator', avatar: undefined },
      { id: '5', name: 'Алексей Новиков', role: 'Business Analyst', avatar: undefined }
    ],
    tasks: {
      total: 12,
      completed: 2,
      inProgress: 3,
      overdue: 0
    },
    priority: 'LOW',
    color: 'orange'
  }
]

export default function ProjectsPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      ON_HOLD: 'bg-yellow-100 text-yellow-800',
      COMPLETED: 'bg-blue-100 text-blue-800',
      CANCELLED: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      ACTIVE: 'Активный',
      ON_HOLD: 'Приостановлен',
      COMPLETED: 'Завершен',
      CANCELLED: 'Отменен'
    }
    return labels[status as keyof typeof labels] || status
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

  const getPriorityLabel = (priority: string) => {
    const labels = {
      LOW: 'Низкий',
      MEDIUM: 'Средний',
      HIGH: 'Высокий',
      URGENT: 'Срочный'
    }
    return labels[priority as keyof typeof labels] || priority
  }

  const filteredProjects = mockProjects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || project.status === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-blue-400">Task Manager</h1>
            <p className="text-sm text-slate-400">Проекты</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  ← Назад к дашборду
                </button>
              </li>
              <li>
                <button className="w-full flex items-center px-4 py-3 text-left rounded-lg bg-blue-900/50 text-blue-300 border-r-2 border-blue-400">
                  📁 Проекты
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Всего проектов:</span>
                  <span className="text-white">{mockProjects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Активных:</span>
                  <span className="text-white">{mockProjects.filter(p => p.status === 'ACTIVE').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Завершенных:</span>
                  <span className="text-white">{mockProjects.filter(p => p.status === 'COMPLETED').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Приостановленных:</span>
                  <span className="text-white">{mockProjects.filter(p => p.status === 'ON_HOLD').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Команда:</span>
                  <span className="text-white">{mockProjects.reduce((sum, p) => sum + p.team.length, 0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Задач:</span>
                  <span className="text-white">{mockProjects.reduce((sum, p) => sum + p.tasks.total, 0)}</span>
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
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">Проекты</h1>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <Grid className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-lg transition-colors ${
                      viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-700'
                    }`}
                  >
                    <List className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Поиск проектов..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">Все проекты</option>
                  <option value="ACTIVE">Активные</option>
                  <option value="ON_HOLD">Приостановленные</option>
                  <option value="COMPLETED">Завершенные</option>
                </select>
                <button 
                  onClick={() => router.push('/projects/templates')}
                  className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 flex items-center space-x-2 transition-colors"
                >
                  <Filter className="w-4 h-4" />
                  <span>Шаблоны</span>
                </button>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Новый проект</span>
                </button>
              </div>
            </div>
          </header>

          {/* Контент */}
          <main className="flex-1 p-6 custom-scrollbar">
            {/* Статистика проектов */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Всего проектов</p>
                    <p className="text-3xl font-bold text-white mt-2">{mockProjects.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">+2</span>
                    <span className="text-slate-400 ml-2">за этот месяц</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Активные</p>
                    <p className="text-3xl font-bold text-white mt-2">{mockProjects.filter(p => p.status === 'ACTIVE').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">A</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">+1</span>
                    <span className="text-slate-400 ml-2">за эту неделю</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Завершенные</p>
                    <p className="text-3xl font-bold text-white mt-2">{mockProjects.filter(p => p.status === 'COMPLETED').length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">+3</span>
                    <span className="text-slate-400 ml-2">за этот месяц</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Команда</p>
                    <p className="text-3xl font-bold text-white mt-2">{mockProjects.reduce((sum, p) => sum + p.team.length, 0)}</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">T</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">+2</span>
                    <span className="text-slate-400 ml-2">новых участника</span>
                  </div>
                </div>
              </div>
            </div>

            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map((project) => (
                  <div
                    key={project.id}
                    className={`bg-slate-800 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer border-l-4 ${getPriorityColor(project.priority)}`}
                    onClick={() => router.push(`/projects/${project.id}`)}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{project.name}</h3>
                        <p className="text-slate-400 text-sm mb-3 line-clamp-2">{project.description}</p>
                        <div className="flex items-center space-x-2 mb-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                            {getStatusLabel(project.status)}
                          </span>
                          <span className="text-xs text-slate-500">
                            {getPriorityLabel(project.priority)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Прогресс */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-slate-300">Прогресс</span>
                        <span className="text-sm font-medium text-white">{project.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-700 rounded-full h-2">
                        <div 
                          className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Статистика */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{project.tasks.total}</div>
                        <div className="text-xs text-slate-400">Задач</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{project.tasks.completed}</div>
                        <div className="text-xs text-slate-400">Выполнено</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{project.team.length}</div>
                        <div className="text-xs text-slate-400">Участников</div>
                      </div>
                    </div>

                    {/* Команда */}
                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-2">
                        {project.team.slice(0, 3).map((member, index) => (
                          <div
                            key={member.id}
                            className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-slate-800"
                            title={member.name}
                          >
                            {member.name.charAt(0)}
                          </div>
                        ))}
                        {project.team.length > 3 && (
                          <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-slate-800">
                            +{project.team.length - 3}
                          </div>
                        )}
                      </div>
                      <div className="text-xs text-slate-400">
                        {format(new Date(project.endDate), 'dd MMM yyyy', { locale: ru })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Проект</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Прогресс</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Команда</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Срок</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredProjects.map((project) => (
                        <tr key={project.id} className="hover:bg-slate-700/50 transition-colors">
                          <td className="px-6 py-4">
                            <div>
                              <div className="text-sm font-medium text-white">{project.name}</div>
                              <div className="text-sm text-slate-400">{project.description}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                              {getStatusLabel(project.status)}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <div className="w-16 bg-slate-700 rounded-full h-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full"
                                  style={{ width: `${project.progress}%` }}
                                ></div>
                              </div>
                              <span className="text-sm text-white">{project.progress}%</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex -space-x-2">
                              {project.team.slice(0, 3).map((member) => (
                                <div
                                  key={member.id}
                                  className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-slate-800"
                                  title={member.name}
                                >
                                  {member.name.charAt(0)}
                                </div>
                              ))}
                              {project.team.length > 3 && (
                                <div className="w-8 h-8 bg-slate-600 rounded-full flex items-center justify-center text-white font-medium text-sm border-2 border-slate-800">
                                  +{project.team.length - 3}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-400">
                            {format(new Date(project.endDate), 'dd MMM yyyy', { locale: ru })}
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => router.push(`/projects/${project.id}`)}
                              className="text-blue-400 hover:text-blue-300 text-sm"
                            >
                              Открыть
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-500 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Проекты не найдены</h3>
                <p className="text-slate-500 mb-4">Попробуйте изменить фильтры или создать новый проект</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Создать проект
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
