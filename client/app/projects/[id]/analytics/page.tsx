'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  PieChart,
  Activity
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

// Моковые данные для аналитики
const mockAnalytics = {
  overview: {
    totalTasks: 24,
    completedTasks: 16,
    inProgressTasks: 6,
    overdueTasks: 2,
    teamMembers: 4,
    projectDuration: 60,
    budgetUsed: 65,
    efficiency: 78
  },
  taskStatus: [
    { status: 'Завершено', count: 16, percentage: 67, color: 'bg-green-500' },
    { status: 'В работе', count: 6, percentage: 25, color: 'bg-blue-500' },
    { status: 'Просрочено', count: 2, percentage: 8, color: 'bg-red-500' }
  ],
  teamPerformance: [
    { name: 'Иван Петров', completed: 8, inProgress: 2, efficiency: 85, avatar: undefined },
    { name: 'Анна Смирнова', completed: 5, inProgress: 3, efficiency: 72, avatar: undefined },
    { name: 'Петр Иванов', completed: 3, inProgress: 1, efficiency: 90, avatar: undefined },
    { name: 'Мария Козлова', completed: 0, inProgress: 0, efficiency: 0, avatar: undefined }
  ],
  timeTracking: [
    { date: '2024-11-01', hours: 8 },
    { date: '2024-11-02', hours: 7.5 },
    { date: '2024-11-03', hours: 8.5 },
    { date: '2024-11-04', hours: 6 },
    { date: '2024-11-05', hours: 8 },
    { date: '2024-11-06', hours: 7 },
    { date: '2024-11-07', hours: 8.5 }
  ],
  budgetAnalysis: {
    planned: 150000,
    spent: 97500,
    remaining: 52500,
    categories: [
      { name: 'Разработка', amount: 60000, percentage: 62 },
      { name: 'Дизайн', amount: 25000, percentage: 26 },
      { name: 'Тестирование', amount: 12500, percentage: 12 }
    ]
  },
  milestones: [
    { name: 'Планирование', date: '2024-11-15', status: 'COMPLETED', progress: 100 },
    { name: 'MVP', date: '2024-12-15', status: 'IN_PROGRESS', progress: 75 },
    { name: 'Бета-тест', date: '2024-12-25', status: 'PENDING', progress: 0 },
    { name: 'Релиз', date: '2024-12-31', status: 'PENDING', progress: 0 }
  ]
}

export default function AnalyticsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [timeRange, setTimeRange] = useState('week')

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

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Левая боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Аналитика</p>
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
              <h3 className="text-sm font-medium text-slate-300 mb-2">Период</h3>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="w-full px-3 py-2 bg-slate-600 border border-slate-500 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="week">Неделя</option>
                <option value="month">Месяц</option>
                <option value="quarter">Квартал</option>
                <option value="year">Год</option>
              </select>
            </div>
          </div>
        </div>

        {/* Основной контент */}
        <div className="flex-1 flex flex-col">
          {/* Заголовок */}
          <header className="bg-slate-800 shadow-sm border-b border-slate-700 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-white">Аналитика проекта</h1>
                <p className="text-slate-400">Отчеты и метрики производительности</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                  <BarChart3 className="w-4 h-4" />
                  <span>Экспорт отчета</span>
                </button>
              </div>
            </div>
          </header>

          {/* Контент */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="space-y-6">
              {/* Общая статистика */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Всего задач</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.overview.totalTasks}</p>
                    </div>
                    <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-green-400">+12%</span>
                      <span className="text-slate-400 ml-2">с прошлой недели</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Выполнено</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.overview.completedTasks}</p>
                    </div>
                    <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-green-400">+8%</span>
                      <span className="text-slate-400 ml-2">с прошлой недели</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Эффективность</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.overview.efficiency}%</p>
                    </div>
                    <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-green-400">+5%</span>
                      <span className="text-slate-400 ml-2">с прошлой недели</span>
                    </div>
                  </div>
                </div>

                <div className="bg-slate-800 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-slate-400 text-sm">Бюджет</p>
                      <p className="text-2xl font-bold text-white">{mockAnalytics.overview.budgetUsed}%</p>
                    </div>
                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center text-sm">
                      <span className="text-orange-400">₽{mockAnalytics.budgetAnalysis.spent.toLocaleString()}</span>
                      <span className="text-slate-400 ml-2">из ₽{mockAnalytics.budgetAnalysis.planned.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Графики */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Статус задач */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Статус задач</h3>
                  <div className="space-y-4">
                    {mockAnalytics.taskStatus.map((item, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-4 h-4 rounded ${item.color}`}></div>
                          <span className="text-slate-300">{item.status}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">{item.count}</span>
                          <div className="w-20 bg-slate-700 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${item.color}`}
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-400 text-sm w-8">{item.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Производительность команды */}
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Производительность команды</h3>
                  <div className="space-y-4">
                    {mockAnalytics.teamPerformance.map((member, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <div className="text-white font-medium">{member.name}</div>
                            <div className="text-slate-400 text-sm">
                              {member.completed} завершено, {member.inProgress} в работе
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-white font-medium">{member.efficiency}%</div>
                          <div className="text-slate-400 text-sm">эффективность</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Анализ бюджета */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Анализ бюджета</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      ₽{mockAnalytics.budgetAnalysis.spent.toLocaleString()}
                    </div>
                    <div className="text-slate-400 text-sm">Потрачено</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      ₽{mockAnalytics.budgetAnalysis.remaining.toLocaleString()}
                    </div>
                    <div className="text-slate-400 text-sm">Остаток</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white mb-2">
                      {Math.round((mockAnalytics.budgetAnalysis.spent / mockAnalytics.budgetAnalysis.planned) * 100)}%
                    </div>
                    <div className="text-slate-400 text-sm">Использовано</div>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="text-white font-medium mb-3">Расходы по категориям</h4>
                  <div className="space-y-3">
                    {mockAnalytics.budgetAnalysis.categories.map((category, index) => (
                      <div key={index} className="flex items-center justify-between">
                        <span className="text-slate-300">{category.name}</span>
                        <div className="flex items-center space-x-3">
                          <span className="text-white font-medium">₽{category.amount.toLocaleString()}</span>
                          <div className="w-24 bg-slate-700 rounded-full h-2">
                            <div 
                              className="bg-blue-500 h-2 rounded-full"
                              style={{ width: `${category.percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-slate-400 text-sm w-8">{category.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Вехи проекта */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Вехи проекта</h3>
                <div className="space-y-4">
                  {mockAnalytics.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-700 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(milestone.status)}`}></div>
                        <div>
                          <div className="text-white font-medium">{milestone.name}</div>
                          <div className="text-slate-400 text-sm">
                            {format(new Date(milestone.date), 'dd MMMM yyyy', { locale: ru })}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <div className="text-white font-medium">{milestone.progress}%</div>
                          <div className="text-slate-400 text-sm">прогресс</div>
                        </div>
                        <div className="w-16 bg-slate-600 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full ${getStatusColor(milestone.status)}`}
                            style={{ width: `${milestone.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Временная шкала активности */}
              <div className="bg-slate-800 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Активность по дням</h3>
                <div className="space-y-2">
                  {mockAnalytics.timeTracking.map((day, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="text-slate-300 text-sm">
                        {format(new Date(day.date), 'dd MMM', { locale: ru })}
                      </span>
                      <div className="flex items-center space-x-3">
                        <div className="w-32 bg-slate-700 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(day.hours / 8) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-white text-sm w-12">{day.hours}ч</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  )
}
