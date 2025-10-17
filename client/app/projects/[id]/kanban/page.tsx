'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Plus, 
  MoreVertical, 
  User, 
  Calendar, 
  AlertCircle,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

// Моковые данные для канбан досок
const mockTasks = {
  TODO: [
    {
      id: '1',
      title: 'Создание макетов интерфейса',
      description: 'Разработка wireframes и mockups для основных экранов приложения',
      priority: 'HIGH',
      assignee: { name: 'Анна Смирнова', avatar: undefined },
      dueDate: '2024-12-15',
      tags: ['UI/UX', 'Дизайн'],
      estimatedHours: 16
    },
    {
      id: '2',
      title: 'Настройка CI/CD пайплайна',
      description: 'Автоматизация развертывания и тестирования',
      priority: 'MEDIUM',
      assignee: { name: 'Петр Иванов', avatar: undefined },
      dueDate: '2024-12-20',
      tags: ['DevOps', 'Автоматизация'],
      estimatedHours: 12
    }
  ],
  IN_PROGRESS: [
    {
      id: '3',
      title: 'Разработка API сервера',
      description: 'Создание REST API для мобильного приложения',
      priority: 'HIGH',
      assignee: { name: 'Петр Иванов', avatar: undefined },
      dueDate: '2024-12-10',
      tags: ['Backend', 'API'],
      estimatedHours: 24,
      progress: 65
    },
    {
      id: '4',
      title: 'Интеграция с базой данных',
      description: 'Настройка подключения и миграций',
      priority: 'MEDIUM',
      assignee: { name: 'Иван Петров', avatar: undefined },
      dueDate: '2024-12-12',
      tags: ['База данных', 'Backend'],
      estimatedHours: 8,
      progress: 30
    }
  ],
  IN_REVIEW: [
    {
      id: '5',
      title: 'Тестирование авторизации',
      description: 'Проверка безопасности и функциональности входа',
      priority: 'HIGH',
      assignee: { name: 'Анна Смирнова', avatar: undefined },
      dueDate: '2024-12-08',
      tags: ['Тестирование', 'Безопасность'],
      estimatedHours: 6,
      progress: 90
    }
  ],
  DONE: [
    {
      id: '6',
      title: 'Настройка проекта',
      description: 'Инициализация репозитория и базовой структуры',
      priority: 'LOW',
      assignee: { name: 'Иван Петров', avatar: undefined },
      dueDate: '2024-11-30',
      tags: ['Настройка', 'DevOps'],
      estimatedHours: 4,
      completedAt: '2024-11-30'
    }
  ]
}

const columns = [
  { id: 'TODO', title: 'К выполнению', color: 'bg-slate-600', count: mockTasks.TODO.length },
  { id: 'IN_PROGRESS', title: 'В работе', color: 'bg-blue-600', count: mockTasks.IN_PROGRESS.length },
  { id: 'IN_REVIEW', title: 'На проверке', color: 'bg-yellow-600', count: mockTasks.IN_REVIEW.length },
  { id: 'DONE', title: 'Выполнено', color: 'bg-green-600', count: mockTasks.DONE.length }
]

export default function KanbanPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [tasks, setTasks] = useState(mockTasks)
  const [draggedTask, setDraggedTask] = useState<string | null>(null)

  const getPriorityColor = (priority: string) => {
    const colors = {
      LOW: 'bg-green-100 text-green-800 border-green-200',
      MEDIUM: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      HIGH: 'bg-orange-100 text-orange-800 border-orange-200',
      URGENT: 'bg-red-100 text-red-800 border-red-200'
    }
    return colors[priority as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200'
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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    setDraggedTask(taskId)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
  }

  const handleDrop = (e: React.DragEvent, targetColumn: string) => {
    e.preventDefault()
    if (!draggedTask) return

    // Находим задачу в текущем состоянии
    let sourceColumn = ''
    let task = null
    for (const [column, taskList] of Object.entries(tasks)) {
      const foundTask = taskList.find(t => t.id === draggedTask)
      if (foundTask) {
        sourceColumn = column
        task = foundTask
        break
      }
    }

    if (task && sourceColumn !== targetColumn) {
      // Удаляем задачу из исходной колонки
      const newTasks = { ...tasks }
      newTasks[sourceColumn as keyof typeof tasks] = newTasks[sourceColumn as keyof typeof tasks].filter(t => t.id !== draggedTask)
      
      // Добавляем задачу в целевую колонку
      newTasks[targetColumn as keyof typeof tasks] = [...newTasks[targetColumn as keyof typeof tasks], task]
      
      setTasks(newTasks)
    }

    setDraggedTask(null)
  }

  const addNewTask = (column: string) => {
    const newTask = {
      id: Date.now().toString(),
      title: 'Новая задача',
      description: 'Описание задачи',
      priority: 'MEDIUM' as const,
      assignee: { name: 'Не назначено', avatar: undefined },
      dueDate: format(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), 'yyyy-MM-dd'),
      tags: [],
      estimatedHours: 8
    }

    setTasks(prev => ({
      ...prev,
      [column]: [...prev[column as keyof typeof prev], newTask]
    }))
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Левая боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">K</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Канбан доска</p>
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
                {columns.map(column => (
                  <div key={column.id} className="flex justify-between">
                    <span className="text-slate-400">{column.title}:</span>
                    <span className="text-white">{column.count}</span>
                  </div>
                ))}
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
                <h1 className="text-2xl font-bold text-white">Канбан доска</h1>
                <p className="text-slate-400">Визуальное управление задачами проекта</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Добавить задачу</span>
                </button>
              </div>
            </div>
          </header>

          {/* Канбан доска */}
          <main className="flex-1 p-6 overflow-x-auto">
            <div className="flex space-x-6 min-w-max">
              {columns.map((column) => (
                <div key={column.id} className="flex-shrink-0 w-80">
                  <div className="bg-slate-800 rounded-lg p-4 h-full">
                    {/* Заголовок колонки */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`w-3 h-3 rounded-full ${column.color}`}></div>
                        <h3 className="text-lg font-semibold text-white">{column.title}</h3>
                        <span className="bg-slate-700 text-slate-300 px-2 py-1 rounded-full text-sm">
                          {tasks[column.id as keyof typeof tasks].length}
                        </span>
                      </div>
                      <button
                        onClick={() => addNewTask(column.id)}
                        className="text-slate-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Задачи в колонке */}
                    <div
                      className="space-y-3 min-h-[400px]"
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, column.id)}
                    >
                      {tasks[column.id as keyof typeof tasks].map((task) => (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task.id)}
                          className="bg-slate-700 rounded-lg p-4 hover:bg-slate-600 transition-colors cursor-move"
                        >
                          {/* Заголовок задачи */}
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-white font-medium text-sm leading-tight">{task.title}</h4>
                            <button className="text-slate-400 hover:text-white transition-colors">
                              <MoreVertical className="w-4 h-4" />
                            </button>
                          </div>

                          {/* Описание */}
                          {task.description && (
                            <p className="text-slate-400 text-xs mb-3 line-clamp-2">{task.description}</p>
                          )}

                          {/* Теги */}
                          {task.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {task.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Приоритет */}
                          <div className="mb-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                              {getPriorityLabel(task.priority)}
                            </span>
                          </div>

                          {/* Прогресс (для задач в работе) */}
                          {task.progress !== undefined && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-slate-400">Прогресс</span>
                                <span className="text-xs text-white">{task.progress}%</span>
                              </div>
                              <div className="w-full bg-slate-600 rounded-full h-1">
                                <div 
                                  className="bg-blue-500 h-1 rounded-full transition-all duration-300"
                                  style={{ width: `${task.progress}%` }}
                                ></div>
                              </div>
                            </div>
                          )}

                          {/* Назначенный и дата */}
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                                {task.assignee.name.charAt(0)}
                              </div>
                              <span className="text-xs text-slate-400">{task.assignee.name}</span>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-slate-400">
                              <Calendar className="w-3 h-3" />
                              <span>{format(new Date(task.dueDate), 'dd MMM', { locale: ru })}</span>
                            </div>
                          </div>

                          {/* Оценка времени */}
                          <div className="flex items-center space-x-1 mt-2 text-xs text-slate-400">
                            <Clock className="w-3 h-3" />
                            <span>{task.estimatedHours}ч</span>
                          </div>
                        </div>
                      ))}

                      {/* Пустое состояние */}
                      {tasks[column.id as keyof typeof tasks].length === 0 && (
                        <div className="text-center py-8">
                          <div className="text-slate-500 mb-2">
                            <AlertCircle className="w-8 h-8 mx-auto" />
                          </div>
                          <p className="text-slate-400 text-sm">Нет задач</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
