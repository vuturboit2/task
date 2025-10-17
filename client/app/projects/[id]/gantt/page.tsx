'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Clock,
  User,
  AlertCircle,
  CheckCircle,
  Play,
  Pause
} from 'lucide-react'
import { format, addDays, differenceInDays } from 'date-fns'
import { ru } from 'date-fns/locale'

// Моковые данные для графика Ганта
const mockTasks = [
  {
    id: '1',
    name: 'Планирование проекта',
    startDate: '2024-11-01',
    endDate: '2024-11-15',
    progress: 100,
    status: 'COMPLETED',
    assignee: 'Иван Петров',
    dependencies: [],
    color: 'bg-green-500'
  },
  {
    id: '2',
    name: 'Создание дизайна',
    startDate: '2024-11-10',
    endDate: '2024-11-25',
    progress: 80,
    status: 'IN_PROGRESS',
    assignee: 'Анна Смирнова',
    dependencies: ['1'],
    color: 'bg-blue-500'
  },
  {
    id: '3',
    name: 'Разработка API',
    startDate: '2024-11-20',
    endDate: '2024-12-10',
    progress: 60,
    status: 'IN_PROGRESS',
    assignee: 'Петр Иванов',
    dependencies: ['1'],
    color: 'bg-purple-500'
  },
  {
    id: '4',
    name: 'Фронтенд разработка',
    startDate: '2024-12-01',
    endDate: '2024-12-20',
    progress: 30,
    status: 'IN_PROGRESS',
    assignee: 'Анна Смирнова',
    dependencies: ['2'],
    color: 'bg-orange-500'
  },
  {
    id: '5',
    name: 'Интеграция',
    startDate: '2024-12-15',
    endDate: '2024-12-25',
    progress: 0,
    status: 'PENDING',
    assignee: 'Петр Иванов',
    dependencies: ['3', '4'],
    color: 'bg-red-500'
  },
  {
    id: '6',
    name: 'Тестирование',
    startDate: '2024-12-20',
    endDate: '2024-12-30',
    progress: 0,
    status: 'PENDING',
    assignee: 'Иван Петров',
    dependencies: ['5'],
    color: 'bg-yellow-500'
  }
]

const milestones = [
  {
    id: 'm1',
    name: 'MVP готов',
    date: '2024-12-15',
    status: 'PENDING'
  },
  {
    id: 'm2',
    name: 'Бета-версия',
    date: '2024-12-25',
    status: 'PENDING'
  },
  {
    id: 'm3',
    name: 'Релиз',
    date: '2024-12-31',
    status: 'PENDING'
  }
]

export default function GanttPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [viewMode, setViewMode] = useState<'week' | 'month'>('week')
  const [selectedTask, setSelectedTask] = useState<string | null>(null)

  const projectStartDate = new Date('2024-11-01')
  const projectEndDate = new Date('2024-12-31')
  const totalDays = differenceInDays(projectEndDate, projectStartDate) + 1

  const getStatusColor = (status: string) => {
    const colors = {
      COMPLETED: 'bg-green-500',
      IN_PROGRESS: 'bg-blue-500',
      PENDING: 'bg-slate-500',
      OVERDUE: 'bg-red-500'
    }
    return colors[status as keyof typeof colors] || 'bg-slate-500'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      COMPLETED: 'Завершено',
      IN_PROGRESS: 'В работе',
      PENDING: 'Ожидает',
      OVERDUE: 'Просрочено'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getTaskPosition = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const startOffset = differenceInDays(start, projectStartDate)
    const duration = differenceInDays(end, start) + 1
    
    return {
      left: `${(startOffset / totalDays) * 100}%`,
      width: `${(duration / totalDays) * 100}%`
    }
  }

  const getMilestonePosition = (date: string) => {
    const milestoneDate = new Date(date)
    const offset = differenceInDays(milestoneDate, projectStartDate)
    return {
      left: `${(offset / totalDays) * 100}%`
    }
  }

  const generateTimeline = () => {
    const dates = []
    const current = new Date(projectStartDate)
    const end = new Date(projectEndDate)
    
    while (current <= end) {
      dates.push(new Date(current))
      current.setDate(current.getDate() + 1)
    }
    
    return dates
  }

  const timeline = generateTimeline()

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Левая боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">G</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">График Ганта</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push(`/projects/${params.id}`)}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Назад к проекту
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Всего задач:</span>
                  <span className="text-white">{mockTasks.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Завершено:</span>
                  <span className="text-white">{mockTasks.filter(t => t.status === 'COMPLETED').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">В работе:</span>
                  <span className="text-white">{mockTasks.filter(t => t.status === 'IN_PROGRESS').length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Вехи:</span>
                  <span className="text-white">{milestones.length}</span>
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
                <h1 className="text-2xl font-bold text-white">График Ганта</h1>
                <p className="text-slate-400">Временная шкала проекта</p>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setViewMode('week')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      viewMode === 'week' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Неделя
                  </button>
                  <button
                    onClick={() => setViewMode('month')}
                    className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                      viewMode === 'month' ? 'bg-blue-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                    }`}
                  >
                    Месяц
                  </button>
                </div>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Добавить задачу</span>
                </button>
              </div>
            </div>
          </header>

          {/* График Ганта */}
          <main className="flex-1 overflow-auto">
            <div className="p-6">
              {/* Временная шкала */}
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="flex">
                  {/* Левая панель с задачами */}
                  <div className="w-80 bg-slate-800 border-r border-slate-700">
                    <div className="p-4 border-b border-slate-700">
                      <h3 className="text-white font-semibold">Задачи</h3>
                    </div>
                    <div className="space-y-1">
                      {mockTasks.map((task) => (
                        <div
                          key={task.id}
                          className={`p-3 border-l-4 ${task.color} bg-slate-700 hover:bg-slate-600 transition-colors cursor-pointer ${
                            selectedTask === task.id ? 'ring-2 ring-blue-500' : ''
                          }`}
                          onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-white font-medium text-sm">{task.name}</h4>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)} text-white`}>
                              {task.progress}%
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400">
                            <User className="w-3 h-3" />
                            <span>{task.assignee}</span>
                          </div>
                          <div className="flex items-center space-x-2 text-xs text-slate-400 mt-1">
                            <Calendar className="w-3 h-3" />
                            <span>
                              {format(new Date(task.startDate), 'dd MMM', { locale: ru })} - {format(new Date(task.endDate), 'dd MMM', { locale: ru })}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* График */}
                  <div className="flex-1 overflow-x-auto">
                    {/* Заголовок временной шкалы */}
                    <div className="bg-slate-700 border-b border-slate-600">
                      <div className="flex h-12">
                        {timeline.map((date, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-16 border-r border-slate-600 flex items-center justify-center"
                          >
                            <span className="text-xs text-slate-300">
                              {format(date, 'dd MMM', { locale: ru })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Задачи на графике */}
                    <div className="relative bg-slate-800 min-h-[400px]">
                      {/* Сетка */}
                      <div className="absolute inset-0 flex">
                        {timeline.map((_, index) => (
                          <div
                            key={index}
                            className="flex-shrink-0 w-16 border-r border-slate-700"
                          ></div>
                        ))}
                      </div>

                      {/* Задачи */}
                      {mockTasks.map((task) => {
                        const position = getTaskPosition(task.startDate, task.endDate)
                        return (
                          <div
                            key={task.id}
                            className={`absolute top-4 h-8 rounded ${task.color} border border-white/20 flex items-center px-2 text-white text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${
                              selectedTask === task.id ? 'ring-2 ring-blue-400' : ''
                            }`}
                            style={{
                              left: position.left,
                              width: position.width,
                              top: `${(mockTasks.indexOf(task) + 1) * 60}px`
                            }}
                            onClick={() => setSelectedTask(selectedTask === task.id ? null : task.id)}
                          >
                            <div className="flex items-center justify-between w-full">
                              <span className="truncate">{task.name}</span>
                              <span className="ml-2">{task.progress}%</span>
                            </div>
                            {/* Прогресс внутри задачи */}
                            <div
                              className="absolute inset-0 bg-white/20 rounded"
                              style={{ width: `${task.progress}%` }}
                            ></div>
                          </div>
                        )
                      })}

                      {/* Вехи */}
                      {milestones.map((milestone) => {
                        const position = getMilestonePosition(milestone.date)
                        return (
                          <div
                            key={milestone.id}
                            className="absolute top-0 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-yellow-400"
                            style={{
                              left: position.left,
                              top: '10px'
                            }}
                            title={milestone.name}
                          ></div>
                        )
                      })}

                      {/* Текущая дата */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10"
                        style={{
                          left: `${(differenceInDays(new Date(), projectStartDate) / totalDays) * 100}%`
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Легенда */}
              <div className="mt-6 bg-slate-800 rounded-lg p-4">
                <h3 className="text-white font-semibold mb-3">Легенда</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-slate-300 text-sm">Завершено</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-slate-300 text-sm">В работе</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-slate-500 rounded"></div>
                    <span className="text-slate-300 text-sm">Ожидает</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-0 h-0 border-l-2 border-r-2 border-b-4 border-l-transparent border-r-transparent border-b-yellow-400"></div>
                    <span className="text-slate-300 text-sm">Веха</span>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
