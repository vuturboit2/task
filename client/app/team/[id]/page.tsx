'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  Clock,
  User,
  Settings,
  Crown,
  Shield,
  Users,
  CheckCircle,
  AlertCircle,
  Activity,
  BarChart3,
  Target,
  TrendingUp
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

// Моковые данные для участника команды
const mockMember = {
  id: '1',
  name: 'Иван Петров',
  email: 'ivan.petrov@company.com',
  role: 'ADMIN',
  position: 'Руководитель проектов',
  avatar: undefined,
  status: 'ACTIVE',
  joinDate: '2024-01-15',
  lastActive: '2024-11-25T14:30:00Z',
  phone: '+7 (999) 123-45-67',
  department: 'Управление',
  skills: ['Управление проектами', 'Планирование', 'Аналитика', 'Лидерство'],
  bio: 'Опытный руководитель с более чем 10-летним стажем в управлении IT-проектами. Специализируется на Agile методологиях и построении эффективных команд.',
  projects: [
    { id: '1', name: 'Разработка мобильного приложения', role: 'Project Manager', status: 'ACTIVE' },
    { id: '2', name: 'Обновление веб-сайта', role: 'Project Manager', status: 'ACTIVE' },
    { id: '3', name: 'Внедрение CRM системы', role: 'Project Manager', status: 'ON_HOLD' }
  ],
  tasks: {
    total: 15,
    completed: 12,
    inProgress: 2,
    overdue: 1
  },
  efficiency: 95,
  workingHours: {
    thisWeek: 42,
    lastWeek: 38,
    average: 40
  },
  achievements: [
    { id: '1', title: 'Лучший менеджер месяца', date: '2024-10-01', description: 'За высокие показатели эффективности команды' },
    { id: '2', title: 'Успешный запуск проекта', date: '2024-09-15', description: 'Проект завершен на 2 недели раньше срока' },
    { id: '3', title: 'Сертификация PMP', date: '2024-08-20', description: 'Получена сертификация Project Management Professional' }
  ],
  recentActivity: [
    { id: '1', action: 'Завершил задачу', description: 'Планирование спринта', time: '2 часа назад' },
    { id: '2', action: 'Создал проект', description: 'Новый проект "Мобильное приложение"', time: '1 день назад' },
    { id: '3', action: 'Назначил задачу', description: 'Анне Смирновой - дизайн интерфейса', time: '2 дня назад' }
  ]
}

const roles = [
  { id: 'ADMIN', name: 'Администратор', color: 'bg-red-100 text-red-800', icon: Crown, description: 'Полный доступ ко всем функциям системы' },
  { id: 'MANAGER', name: 'Менеджер', color: 'bg-blue-100 text-blue-800', icon: Shield, description: 'Управление проектами и командой' },
  { id: 'MEMBER', name: 'Участник', color: 'bg-green-100 text-green-800', icon: Users, description: 'Участие в проектах и задачах' }
]

export default function TeamMemberPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('overview')
  const [showEditForm, setShowEditForm] = useState(false)

  const member = mockMember

  const getRoleInfo = (roleId: string) => {
    return roles.find(role => role.id === roleId) || roles[2]
  }

  const getStatusColor = (status: string) => {
    const colors = {
      ACTIVE: 'bg-green-100 text-green-800',
      AWAY: 'bg-yellow-100 text-yellow-800',
      INACTIVE: 'bg-gray-100 text-gray-800'
    }
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      ACTIVE: 'Активен',
      AWAY: 'Отсутствует',
      INACTIVE: 'Неактивен'
    }
    return labels[status as keyof typeof labels] || status
  }

  const tabs = [
    { id: 'overview', label: 'Обзор', icon: User },
    { id: 'projects', label: 'Проекты', icon: Target },
    { id: 'activity', label: 'Активность', icon: Activity },
    { id: 'analytics', label: 'Аналитика', icon: BarChart3 }
  ]

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Левая боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">T</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Профиль участника</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/team')}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Назад к команде
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Проектов:</span>
                  <span className="text-white">{member.projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Задач:</span>
                  <span className="text-white">{member.tasks.total}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Эффективность:</span>
                  <span className="text-white">{member.efficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Часов/неделя:</span>
                  <span className="text-white">{member.workingHours.thisWeek}</span>
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
                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                  {member.name.charAt(0)}
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">{member.name}</h1>
                  <div className="flex items-center space-x-4 mt-1">
                    <span className="text-slate-400">{member.position}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(member.status)}`}>
                      {getStatusLabel(member.status)}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleInfo(member.role).color}`}>
                      {getRoleInfo(member.role).name}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 flex items-center space-x-2 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Написать</span>
                </button>
                <button 
                  onClick={() => setShowEditForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                >
                  <Edit className="w-4 h-4" />
                  <span>Редактировать</span>
                </button>
              </div>
            </div>
          </header>

          {/* Вкладки */}
          <div className="bg-slate-800 border-b border-slate-700">
            <div className="px-6">
              <nav className="flex space-x-8">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-400'
                          : 'border-transparent text-slate-400 hover:text-slate-300'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </nav>
            </div>
          </div>

          {/* Контент вкладок */}
          <main className="flex-1 p-6">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Основная информация */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2 space-y-6">
                    {/* Биография */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">О участнике</h3>
                      <p className="text-slate-300 leading-relaxed">{member.bio}</p>
                    </div>

                    {/* Навыки */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Навыки</h3>
                      <div className="flex flex-wrap gap-2">
                        {member.skills.map((skill, index) => (
                          <span key={index} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Достижения */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Достижения</h3>
                      <div className="space-y-4">
                        {member.achievements.map((achievement) => (
                          <div key={achievement.id} className="flex items-start space-x-3">
                            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                              <span className="text-yellow-600 text-sm">🏆</span>
                            </div>
                            <div>
                              <h4 className="text-white font-medium">{achievement.title}</h4>
                              <p className="text-slate-400 text-sm">{achievement.description}</p>
                              <p className="text-slate-500 text-xs">
                                {format(new Date(achievement.date), 'dd MMMM yyyy', { locale: ru })}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Контактная информация */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Контакты</h3>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Mail className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Phone className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">{member.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            С {format(new Date(member.joinDate), 'dd MMMM yyyy', { locale: ru })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Clock className="w-4 h-4 text-slate-400" />
                          <span className="text-slate-300">
                            Последняя активность: {format(new Date(member.lastActive), 'dd MMM HH:mm', { locale: ru })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Статистика работы */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Статистика</h3>
                      <div className="space-y-4">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Всего задач:</span>
                          <span className="text-white font-medium">{member.tasks.total}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Выполнено:</span>
                          <span className="text-green-400 font-medium">{member.tasks.completed}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">В работе:</span>
                          <span className="text-blue-400 font-medium">{member.tasks.inProgress}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Просрочено:</span>
                          <span className="text-red-400 font-medium">{member.tasks.overdue}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Эффективность:</span>
                          <span className="text-white font-medium">{member.efficiency}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Рабочие часы */}
                    <div className="bg-slate-800 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Рабочие часы</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-slate-400">Эта неделя:</span>
                          <span className="text-white font-medium">{member.workingHours.thisWeek}ч</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Прошлая неделя:</span>
                          <span className="text-white font-medium">{member.workingHours.lastWeek}ч</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">Среднее:</span>
                          <span className="text-white font-medium">{member.workingHours.average}ч/нед</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Проекты участника</h3>
                  <div className="space-y-4">
                    {member.projects.map((project) => (
                      <div key={project.id} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-white font-medium">{project.name}</h4>
                            <p className="text-slate-400 text-sm">Роль: {project.role}</p>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            project.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                            project.status === 'ON_HOLD' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {project.status === 'ACTIVE' ? 'Активный' : 
                             project.status === 'ON_HOLD' ? 'Приостановлен' : 'Завершен'}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Последняя активность</h3>
                  <div className="space-y-4">
                    {member.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-start space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <Activity className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-white">{activity.action}: {activity.description}</p>
                          <p className="text-slate-400 text-sm">{activity.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Продуктивность</h3>
                    <div className="text-3xl font-bold text-white mb-2">{member.efficiency}%</div>
                    <div className="w-full bg-slate-700 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: `${member.efficiency}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Задачи</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Выполнено:</span>
                        <span className="text-green-400">{member.tasks.completed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">В работе:</span>
                        <span className="text-blue-400">{member.tasks.inProgress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Просрочено:</span>
                        <span className="text-red-400">{member.tasks.overdue}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-800 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-white mb-4">Рабочие часы</h3>
                    <div className="text-3xl font-bold text-white mb-2">{member.workingHours.thisWeek}ч</div>
                    <div className="text-slate-400 text-sm">на этой неделе</div>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
