'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Edit, Trash2, Calendar, User, Eye, MessageSquare, Paperclip, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuth } from '../../providers'
import { mockTasks } from '../../components/MockData'
import toast from 'react-hot-toast'

export default function TaskDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const [task, setTask] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showEditForm, setShowEditForm] = useState(false)
  const [newComment, setNewComment] = useState('')
  const [comments, setComments] = useState([
    {
      id: '1',
      content: 'Начал работу над задачей',
      user: { name: 'Иван Петров', avatar: undefined },
      createdAt: '2024-12-15T10:00:00Z'
    },
    {
      id: '2', 
      content: 'Проверил требования, все понятно',
      user: { name: 'Анна Смирнова', avatar: undefined },
      createdAt: '2024-12-15T11:30:00Z'
    }
  ])

  useEffect(() => {
    const taskId = params.id as string
    const foundTask = mockTasks.find(t => t.id === taskId)
    
    if (foundTask) {
      setTask(foundTask)
    } else {
      toast.error('Задача не найдена')
      router.push('/dashboard')
    }
    
    setLoading(false)
  }, [params.id, router])

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

  const handleStatusChange = (newStatus: string) => {
    setTask({ ...task, status: newStatus })
    toast.success('Статус обновлен!')
  }

  const handleAddComment = () => {
    if (!newComment.trim()) return

    const comment = {
      id: Date.now().toString(),
      content: newComment,
      user: { name: user?.name || 'Пользователь', avatar: undefined },
      createdAt: new Date().toISOString()
    }

    setComments([comment, ...comments])
    setNewComment('')
    toast.success('Комментарий добавлен!')
  }

  const handleDeleteTask = () => {
    if (confirm('Вы уверены, что хотите удалить эту задачу?')) {
      toast.success('Задача удалена!')
      router.push('/dashboard')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!task) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Задача не найдена</h1>
          <button
            onClick={() => router.push('/dashboard')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Вернуться к дашборду
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.back()}
                className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
            </div>
            <p className="text-sm text-slate-400 mt-2">Детали задачи</p>
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
              <li>
                <button 
                  onClick={() => setShowEditForm(true)}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <Edit className="w-5 h-5 mr-3" />
                  Редактировать задачу
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
                  <span className="text-slate-400">Комментарии:</span>
                  <span className="text-white">{comments.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Наблюдатели:</span>
                  <span className="text-white">{task.watchers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Создано:</span>
                  <span className="text-white">
                    {format(new Date(task.createdAt), 'dd MMM', { locale: ru })}
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
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">{task.title}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
                <span className="text-sm text-slate-400">
                  {getPriorityLabel(task.priority)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEditForm(true)}
                  className="p-2 text-slate-400 hover:text-blue-400 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Edit className="w-5 h-5" />
                </button>
                <button
                  onClick={handleDeleteTask}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Контент */}
          <main className="flex-1 p-6">

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Основная информация */}
              <div className="lg:col-span-2 space-y-6">
                {/* Описание задачи */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold text-white">Описание</h2>
                    <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
                      Редактировать
                    </button>
                  </div>
                  
                  {task.description ? (
                    <div className="prose prose-invert max-w-none">
                      <div className="bg-slate-700 rounded-lg p-4 border-l-4 border-blue-500">
                        <p className="text-slate-300 leading-relaxed mb-0">{task.description}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-slate-700/50 border-2 border-dashed border-slate-600 rounded-lg p-8 text-center">
                      <div className="text-slate-500 mb-2">
                        <svg className="w-12 h-12 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </div>
                      <p className="text-slate-400 mb-3">Описание не добавлено</p>
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Добавить описание
                      </button>
                    </div>
                  )}
                </div>

                {/* Цели и результаты */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Цели и результаты</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                        Цель
                      </h4>
                      <p className="text-slate-300 text-sm">
                        {task.description || 'Цель не определена'}
                      </p>
                    </div>
                    <div className="bg-slate-700 rounded-lg p-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2 flex items-center">
                        <AlertCircle className="w-4 h-4 mr-2 text-orange-400" />
                        Критерии успеха
                      </h4>
                      <p className="text-slate-300 text-sm">
                        Задача считается выполненной, когда все требования выполнены
                      </p>
                    </div>
                  </div>
                </div>

                {/* Прогресс выполнения */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Прогресс выполнения</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-300">Общий прогресс</span>
                      <span className="text-white font-medium">
                        {task.status === 'DONE' ? '100%' : 
                         task.status === 'IN_PROGRESS' ? '50%' : 
                         task.status === 'IN_REVIEW' ? '80%' : '0%'}
                      </span>
                    </div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${
                          task.status === 'DONE' ? 'bg-green-500 w-full' :
                          task.status === 'IN_PROGRESS' ? 'bg-blue-500 w-1/2' :
                          task.status === 'IN_REVIEW' ? 'bg-purple-500 w-4/5' : 'bg-slate-600 w-0'
                        }`}
                      ></div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-slate-600 rounded-full"></div>
                        <span className="text-slate-400">Не начато</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span className="text-slate-400">В работе</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span className="text-slate-400">На проверке</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-slate-400">Выполнено</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Быстрое изменение статуса */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Изменить статус</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE'].map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                          task.status === status
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                        }`}
                      >
                        {getStatusLabel(status)}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Информация о задаче */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Информация</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {task.dueDate && (
                      <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                        <Calendar className="w-5 h-5 text-blue-400" />
                        <div>
                          <p className="text-sm text-slate-400">Срок выполнения</p>
                          <p className="text-white font-medium">
                            {format(new Date(task.dueDate), 'dd MMM yyyy', { locale: ru })}
                          </p>
                        </div>
                      </div>
                    )}
                    {task.assignee && (
                      <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                        <User className="w-5 h-5 text-green-400" />
                        <div>
                          <p className="text-sm text-slate-400">Ответственный</p>
                          <p className="text-white font-medium">{task.assignee.name}</p>
                        </div>
                      </div>
                    )}
                    {task.watchers.length > 0 && (
                      <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                        <Eye className="w-5 h-5 text-purple-400" />
                        <div>
                          <p className="text-sm text-slate-400">Наблюдатели</p>
                          <p className="text-white font-medium">{task.watchers.length} человек</p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                      <Clock className="w-5 h-5 text-orange-400" />
                      <div>
                        <p className="text-sm text-slate-400">Приоритет</p>
                        <p className="text-white font-medium">{getPriorityLabel(task.priority)}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Комментарии */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
                    <MessageSquare className="w-5 h-5 mr-2" />
                    Комментарии ({comments.length})
                  </h3>

                  {/* Добавить комментарий */}
                  <div className="mb-6">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="Добавить комментарий..."
                      className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={3}
                    />
                    <button
                      onClick={handleAddComment}
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Добавить комментарий
                    </button>
                  </div>

                  {/* Список комментариев */}
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-start space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {comment.user.name.charAt(0)}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-medium text-white">{comment.user.name}</span>
                              <span className="text-xs text-slate-400">
                                {format(new Date(comment.createdAt), 'dd MMM yyyy, HH:mm', { locale: ru })}
                              </span>
                            </div>
                            <p className="text-slate-300">{comment.content}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Боковая панель */}
              <div className="space-y-6">
                {/* Участники */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Участники</h3>
                  
                  {task.assignee && (
                    <div className="mb-4">
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Ответственный</h4>
                      <div className="flex items-center space-x-3 p-3 bg-slate-700 rounded-lg">
                        <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-white font-medium">
                          {task.assignee.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-white font-medium">{task.assignee.name}</p>
                          <p className="text-xs text-slate-400">Ответственный</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {task.watchers.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium text-slate-300 mb-2">Наблюдатели</h4>
                      <div className="space-y-2">
                        {task.watchers.map((watcher: any) => (
                          <div key={watcher.id} className="flex items-center space-x-3 p-2 bg-slate-700 rounded-lg">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                              {watcher.name.charAt(0)}
                            </div>
                            <span className="text-white">{watcher.name}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Дополнительные функции */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Дополнительно</h3>
                  <div className="space-y-2">
                    <button className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                      <Paperclip className="w-4 h-4" />
                      <span>Прикрепить файл</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                      <Eye className="w-4 h-4" />
                      <span>Добавить наблюдателя</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                      <User className="w-4 h-4" />
                      <span>Переназначить</span>
                    </button>
                    <button className="w-full flex items-center space-x-2 p-3 bg-slate-700 hover:bg-slate-600 rounded-lg text-white transition-colors">
                      <MessageSquare className="w-4 h-4" />
                      <span>Добавить комментарий</span>
                    </button>
                  </div>
                </div>

                {/* История изменений */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">История</h3>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-slate-300">Задача создана</span>
                      <span className="text-slate-500 text-xs">2 дня назад</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span className="text-slate-300">Статус изменен на "В работе"</span>
                      <span className="text-slate-500 text-xs">1 день назад</span>
                    </div>
                    <div className="flex items-center space-x-3 text-sm">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <span className="text-slate-300">Добавлен комментарий</span>
                      <span className="text-slate-500 text-xs">2 часа назад</span>
                    </div>
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
