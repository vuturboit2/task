'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Calendar, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Plus,
  MessageSquare,
  Paperclip,
  BarChart3,
  Target,
  TrendingUp,
  Activity
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuth } from '../../providers'

// Моковые данные для проекта
const mockProject = {
  id: '1',
  name: 'Разработка мобильного приложения',
  description: 'Создание кроссплатформенного мобильного приложения для управления задачами с современным дизайном и интуитивным интерфейсом',
  status: 'ACTIVE',
  progress: 65,
  startDate: '2024-11-01',
  endDate: '2024-12-31',
  team: [
    { id: '1', name: 'Иван Петров', role: 'Project Manager', avatar: undefined, email: 'ivan@example.com' },
    { id: '2', name: 'Анна Смирнова', role: 'Frontend Developer', avatar: undefined, email: 'anna@example.com' },
    { id: '3', name: 'Петр Иванов', role: 'Backend Developer', avatar: undefined, email: 'petr@example.com' },
    { id: '4', name: 'Мария Козлова', role: 'UI/UX Designer', avatar: undefined, email: 'maria@example.com' }
  ],
  tasks: {
    total: 24,
    completed: 16,
    inProgress: 6,
    overdue: 2
  },
  priority: 'HIGH',
  color: 'blue',
  budget: 150000,
  spent: 97500,
  milestones: [
    { id: '1', name: 'Планирование и дизайн', status: 'COMPLETED', dueDate: '2024-11-15', progress: 100 },
    { id: '2', name: 'Разработка MVP', status: 'IN_PROGRESS', dueDate: '2024-12-15', progress: 75 },
    { id: '3', name: 'Тестирование', status: 'PENDING', dueDate: '2024-12-25', progress: 0 },
    { id: '4', name: 'Запуск', status: 'PENDING', dueDate: '2024-12-31', progress: 0 }
  ]
}

const mockTasks = [
  {
    id: '1',
    title: 'Создание макетов интерфейса',
    status: 'COMPLETED',
    priority: 'HIGH',
    assignee: { name: 'Анна Смирнова', avatar: undefined },
    dueDate: '2024-11-20'
  },
  {
    id: '2',
    title: 'Настройка API сервера',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    assignee: { name: 'Петр Иванов', avatar: undefined },
    dueDate: '2024-12-10'
  },
  {
    id: '3',
    title: 'Интеграция с базой данных',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    assignee: { name: 'Петр Иванов', avatar: undefined },
    dueDate: '2024-12-15'
  },
  {
    id: '4',
    title: 'Тестирование функционала',
    status: 'PENDING',
    priority: 'MEDIUM',
    assignee: { name: 'Иван Петров', avatar: undefined },
    dueDate: '2024-12-20'
  }
]

const mockComments = [
  {
    id: '1',
    author: { name: 'Иван Петров', avatar: undefined },
    content: 'Отличная работа над дизайном! Интерфейс выглядит современно и интуитивно.',
    createdAt: '2024-11-25T10:30:00Z'
  },
  {
    id: '2',
    author: { name: 'Анна Смирнова', avatar: undefined },
    content: 'Спасибо! Уже начал работу над API интеграцией.',
    createdAt: '2024-11-25T14:15:00Z'
  }
]

export default function ProjectDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { user } = useAuth()
  const [showEditForm, setShowEditForm] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState(mockComments)

  const project = mockProject
  const tasks = mockTasks

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

  const getTaskStatusColor = (status: string) => {
    const colors = {
      COMPLETED: 'bg-green-100 text-green-800',
      IN_PROGRESS: 'bg-blue-100 text-blue-800',
      PENDING: 'bg-yellow-100 text-yellow-800',
      OVERDUE: 'bg-red-100 text-red-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getTaskStatusLabel = (status: string) => {
    const labels = {
      COMPLETED: 'Выполнено',
      IN_PROGRESS: 'В работе',
      PENDING: 'Ожидает',
      OVERDUE: 'Просрочено'
    }
    return labels[status as keyof typeof labels] || status
  }

  const getMilestoneStatusColor = (status: string) => {
    const colors = {
      COMPLETED: 'bg-green-500',
      IN_PROGRESS: 'bg-blue-500',
      PENDING: 'bg-slate-500'
    }
    return colors[status as keyof typeof colors] || 'bg-slate-500'
  }

  const handleAddComment = () => {
    if (newComment.trim()) {
      const comment = {
        id: Date.now().toString(),
        author: { name: user?.name || 'Пользователь', avatar: undefined },
        content: newComment,
        createdAt: new Date().toISOString()
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Левая боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Детали проекта</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/projects')}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Назад к проектам
                </button>
              </li>
              <li>
                <button 
                  onClick={() => setShowEditForm(true)}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <Edit className="w-5 h-5 mr-3" />
                  Редактировать проект
                </button>
              </li>
              <li>
                <button className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors">
                  <MessageSquare className="w-5 h-5 mr-3" />
                  Комментарии
                </button>
              </li>
              <li>
                <button className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors">
                  <Paperclip className="w-5 h-5 mr-3" />
                  Файлы
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Задач:</span>
                  <span className="text-white">{project.tasks.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Выполнено:</span>
                  <span className="text-white">{project.tasks.completed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">В работе:</span>
                  <span className="text-white">{project.tasks.inProgress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Просрочено:</span>
                  <span className="text-white">{project.tasks.overdue}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Команда:</span>
                  <span className="text-white">{project.team.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Прогресс:</span>
                  <span className="text-white">{project.progress}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Бюджет:</span>
                  <span className="text-white">₽{project.budget.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Потрачено:</span>
                  <span className="text-white">₽{project.spent.toLocaleString()}</span>
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
                <h1 className="text-2xl font-bold text-white">{project.name}</h1>
                <div className="flex items-center space-x-4 mt-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                  <div className="flex items-center space-x-2 text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span className="text-sm">
                      {format(new Date(project.startDate), 'dd MMM yyyy', { locale: ru })} - {format(new Date(project.endDate), 'dd MMM yyyy', { locale: ru })}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Добавить задачу</span>
                </button>
                <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 flex items-center space-x-2 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Редактировать</span>
                </button>
              </div>
            </div>
          </header>

          {/* Контент */}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Основной контент */}
              <div className="lg:col-span-2 space-y-6">
                {/* Описание проекта */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Описание</h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Редактировать
                    </button>
                  </div>
                  
                  <div className="prose prose-invert max-w-none">
                    <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-blue-500">
                      <p className="text-slate-300 leading-relaxed mb-0">{project.description}</p>
                    </div>
                  </div>
                </div>

                {/* Прогресс выполнения */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Прогресс выполнения</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Общий прогресс</span>
                      <span className="text-white font-medium">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-3">
                      <div 
                        className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <div className="grid grid-cols-4 gap-4 text-sm">
                      <div className="text-center">
                        <div className="text-lg font-bold text-white">{project.tasks.total}</div>
                        <div className="text-slate-400">Всего задач</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-green-400">{project.tasks.completed}</div>
                        <div className="text-slate-400">Выполнено</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-blue-400">{project.tasks.inProgress}</div>
                        <div className="text-slate-400">В работе</div>
                      </div>
                      <div className="text-center">
                        <div className="text-lg font-bold text-red-400">{project.tasks.overdue}</div>
                        <div className="text-slate-400">Просрочено</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Этапы проекта */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Этапы проекта</h3>
                  <div className="space-y-4">
                    {project.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getMilestoneStatusColor(milestone.status)}`}></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-white font-medium">{milestone.name}</span>
                            <span className="text-slate-400 text-sm">
                              {format(new Date(milestone.dueDate), 'dd MMM', { locale: ru })}
                            </span>
                          </div>
                          <div className="w-full bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${milestone.progress}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Задачи проекта */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Задачи проекта</h3>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Показать все
                    </button>
                  </div>
                  <div className="space-y-3">
                    {tasks.map((task) => (
                      <div key={task.id} className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{task.title}</h4>
                            <div className="flex items-center space-x-4 mt-1">
                              <span className="text-slate-400 text-sm">{task.assignee.name}</span>
                              <span className="text-slate-400 text-sm">
                                {format(new Date(task.dueDate), 'dd MMM', { locale: ru })}
                              </span>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskStatusColor(task.status)}`}>
                            {getTaskStatusLabel(task.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Комментарии */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Комментарии</h3>
                  
                  <div className="space-y-4 mb-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {comment.author.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="text-white font-medium text-sm">{comment.author.name}</span>
                              <span className="text-slate-400 text-xs">
                                {format(new Date(comment.createdAt), 'dd MMM HH:mm', { locale: ru })}
                              </span>
                            </div>
                            <p className="text-slate-300 text-sm">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex space-x-3">
                    <input
                      type="text"
                      placeholder="Добавить комментарий..."
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={handleAddComment}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Отправить
                    </button>
                  </div>
                </div>
              </div>

              {/* Правая боковая панель */}
              <div className="space-y-6">
                {/* Команда проекта */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Команда проекта</h3>
                  <div className="space-y-3">
                    {project.team.map((member) => (
                      <div key={member.id} className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                          {member.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="text-white font-medium">{member.name}</div>
                          <div className="text-slate-400 text-sm">{member.role}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button className="w-full mt-4 bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors">
                    Добавить участника
                  </button>
                </div>

                {/* Бюджет */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Бюджет</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Запланировано:</span>
                      <span className="text-white">₽{project.budget.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Потрачено:</span>
                      <span className="text-white">₽{project.spent.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Остаток:</span>
                      <span className="text-white">₽{(project.budget - project.spent).toLocaleString()}</span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
                      <div 
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: `${(project.spent / project.budget) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Быстрые действия */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Действия</h3>
                  <div className="space-y-2">
                    <button 
                      onClick={() => router.push(`/projects/${params.id}/kanban`)}
                      className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Канбан доска</span>
                    </button>
                    <button 
                      onClick={() => router.push(`/projects/${params.id}/gantt`)}
                      className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>График Ганта</span>
                    </button>
                    <button 
                      onClick={() => router.push(`/projects/${params.id}/analytics`)}
                      className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>Аналитика</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                      <Plus className="w-4 h-4" />
                      <span>Добавить задачу</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                      <Users className="w-4 h-4" />
                      <span>Управление командой</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                      <Paperclip className="w-4 h-4" />
                      <span>Прикрепить файл</span>
                    </button>
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
