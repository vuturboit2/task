'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Plus, 
  Search, 
  Filter, 
  Grid, 
  List, 
  UserPlus,
  Settings,
  Mail,
  Phone,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Crown,
  Shield,
  Users
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'
import { useAuth } from '../providers'
import EditMemberForm from '../components/EditMemberForm'
import InviteMemberForm from '../components/InviteMemberForm'

// Моковые данные для команды
const mockTeamMembers = [
  {
    id: '1',
    name: 'Иван Петров',
    email: 'ivan.petrov@company.com',
    role: 'ADMIN',
    position: 'Руководитель проектов',
    avatar: undefined,
    status: 'ACTIVE',
    joinDate: '2024-01-15',
    lastActive: '2024-11-25T14:30:00Z',
    projects: 3,
    tasks: 15,
    completedTasks: 12,
    efficiency: 95,
    phone: '+7 (999) 123-45-67',
    department: 'Управление',
    skills: ['Управление проектами', 'Планирование', 'Аналитика']
  },
  {
    id: '2',
    name: 'Анна Смирнова',
    email: 'anna.smirnova@company.com',
    role: 'MANAGER',
    position: 'Frontend Developer',
    avatar: undefined,
    status: 'ACTIVE',
    joinDate: '2024-02-20',
    lastActive: '2024-11-25T16:45:00Z',
    projects: 2,
    tasks: 8,
    completedTasks: 6,
    efficiency: 88,
    phone: '+7 (999) 234-56-78',
    department: 'Разработка',
    skills: ['React', 'TypeScript', 'UI/UX', 'JavaScript']
  },
  {
    id: '3',
    name: 'Петр Иванов',
    email: 'petr.ivanov@company.com',
    role: 'MEMBER',
    position: 'Backend Developer',
    avatar: undefined,
    status: 'ACTIVE',
    joinDate: '2024-03-10',
    lastActive: '2024-11-25T15:20:00Z',
    projects: 2,
    tasks: 10,
    completedTasks: 8,
    efficiency: 92,
    phone: '+7 (999) 345-67-89',
    department: 'Разработка',
    skills: ['Node.js', 'PostgreSQL', 'API', 'Docker']
  },
  {
    id: '4',
    name: 'Мария Козлова',
    email: 'maria.kozlova@company.com',
    role: 'MEMBER',
    position: 'UI/UX Designer',
    avatar: undefined,
    status: 'ACTIVE',
    joinDate: '2024-04-05',
    lastActive: '2024-11-25T13:15:00Z',
    projects: 1,
    tasks: 5,
    completedTasks: 4,
    efficiency: 85,
    phone: '+7 (999) 456-78-90',
    department: 'Дизайн',
    skills: ['Figma', 'Adobe Creative Suite', 'Прототипирование', 'Исследования']
  },
  {
    id: '5',
    name: 'Алексей Новиков',
    email: 'alexey.novikov@company.com',
    role: 'MEMBER',
    position: 'QA Engineer',
    avatar: undefined,
    status: 'AWAY',
    joinDate: '2024-05-12',
    lastActive: '2024-11-20T10:00:00Z',
    projects: 1,
    tasks: 3,
    completedTasks: 2,
    efficiency: 78,
    phone: '+7 (999) 567-89-01',
    department: 'Тестирование',
    skills: ['Автотесты', 'Selenium', 'Тестирование API', 'Багрепорты']
  }
]

const roles = [
  { id: 'ADMIN', name: 'Администратор', color: 'bg-red-100 text-red-800', icon: Crown },
  { id: 'MANAGER', name: 'Менеджер', color: 'bg-blue-100 text-blue-800', icon: Shield },
  { id: 'MEMBER', name: 'Участник', color: 'bg-green-100 text-green-800', icon: Users }
]

const statuses = [
  { id: 'ACTIVE', name: 'Активен', color: 'bg-green-100 text-green-800' },
  { id: 'AWAY', name: 'Отсутствует', color: 'bg-yellow-100 text-yellow-800' },
  { id: 'INACTIVE', name: 'Неактивен', color: 'bg-gray-100 text-gray-800' }
]

export default function TeamPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteForm, setShowInviteForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [selectedMember, setSelectedMember] = useState<any>(null)

  const getRoleInfo = (roleId: string) => {
    return roles.find(role => role.id === roleId) || roles[2]
  }

  const getStatusInfo = (statusId: string) => {
    return statuses.find(status => status.id === statusId) || statuses[0]
  }

  const filteredMembers = mockTeamMembers.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.position.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filter === 'all' || member.status === filter
    return matchesSearch && matchesFilter
  })

  const activeMembers = mockTeamMembers.filter(m => m.status === 'ACTIVE').length
  const totalProjects = mockTeamMembers.reduce((sum, m) => sum + m.projects, 0)
  const totalTasks = mockTeamMembers.reduce((sum, m) => sum + m.tasks, 0)
  const avgEfficiency = Math.round(mockTeamMembers.reduce((sum, m) => sum + m.efficiency, 0) / mockTeamMembers.length)

  const handleInviteMember = (invitation: any) => {
    console.log('Приглашение отправлено:', invitation)
    // Здесь будет логика отправки приглашения
  }

  const handleEditMember = (member: any) => {
    console.log('Участник обновлен:', member)
    // Здесь будет логика обновления участника
  }

  const handleMemberClick = (member: any) => {
    router.push(`/team/${member.id}`)
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        {/* Боковая панель */}
        <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
          <div className="p-6 border-b border-slate-700">
            <h1 className="text-2xl font-bold text-blue-400">Task Manager</h1>
            <p className="text-sm text-slate-400">Команда</p>
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
                  👥 Команда
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Участников:</span>
                  <span className="text-white">{mockTeamMembers.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Активных:</span>
                  <span className="text-white">{activeMembers}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Проектов:</span>
                  <span className="text-white">{totalProjects}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Эффективность:</span>
                  <span className="text-white">{avgEfficiency}%</span>
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
                <h1 className="text-2xl font-bold text-white">Команда</h1>
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
                    placeholder="Поиск участников..."
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
                  <option value="all">Все участники</option>
                  <option value="ACTIVE">Активные</option>
                  <option value="AWAY">Отсутствующие</option>
                  <option value="INACTIVE">Неактивные</option>
                </select>
                <button 
                  onClick={() => setShowInviteForm(true)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Пригласить</span>
                </button>
              </div>
            </div>
          </header>

          {/* Статистика команды */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Всего участников</p>
                    <p className="text-3xl font-bold text-white mt-2">{mockTeamMembers.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">+1</span>
                    <span className="text-slate-400 ml-2">за этот месяц</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Активные</p>
                    <p className="text-3xl font-bold text-white mt-2">{activeMembers}</p>
                  </div>
                  <div className="w-12 h-12 bg-green-600 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">{Math.round((activeMembers / mockTeamMembers.length) * 100)}%</span>
                    <span className="text-slate-400 ml-2">активности</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Проекты</p>
                    <p className="text-3xl font-bold text-white mt-2">{totalProjects}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-600 rounded-lg flex items-center justify-center">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">+2</span>
                    <span className="text-slate-400 ml-2">в работе</span>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-slate-400 text-sm">Эффективность</p>
                    <p className="text-3xl font-bold text-white mt-2">{avgEfficiency}%</p>
                  </div>
                  <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                </div>
                <div className="mt-4">
                  <div className="flex items-center text-sm">
                    <span className="text-green-400">+5%</span>
                    <span className="text-slate-400 ml-2">за месяц</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Список участников */}
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredMembers.map((member) => {
                  const roleInfo = getRoleInfo(member.role)
                  const statusInfo = getStatusInfo(member.status)
                  const RoleIcon = roleInfo.icon
                  
                  return (
                    <div 
                      key={member.id} 
                      className="bg-slate-800 rounded-lg p-6 hover:bg-slate-750 transition-colors cursor-pointer"
                      onClick={() => handleMemberClick(member)}
                    >
                      {/* Заголовок карточки */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {member.name.charAt(0)}
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-white">{member.name}</h3>
                            <p className="text-slate-400 text-sm">{member.position}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end space-y-1">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                            {roleInfo.name}
                          </span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.name}
                          </span>
                        </div>
                      </div>

                      {/* Контактная информация */}
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Mail className="w-4 h-4" />
                          <span>{member.email}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Phone className="w-4 h-4" />
                          <span>{member.phone}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-sm text-slate-400">
                          <Calendar className="w-4 h-4" />
                          <span>С {format(new Date(member.joinDate), 'dd MMM yyyy', { locale: ru })}</span>
                        </div>
                      </div>

                      {/* Статистика */}
                      <div className="grid grid-cols-3 gap-4 mb-4">
                        <div className="text-center">
                          <div className="text-lg font-bold text-white">{member.projects}</div>
                          <div className="text-xs text-slate-400">Проектов</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-400">{member.completedTasks}</div>
                          <div className="text-xs text-slate-400">Задач</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-blue-400">{member.efficiency}%</div>
                          <div className="text-xs text-slate-400">Эффект.</div>
                        </div>
                      </div>

                      {/* Навыки */}
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-slate-300 mb-2">Навыки</h4>
                        <div className="flex flex-wrap gap-1">
                          {member.skills.slice(0, 3).map((skill, index) => (
                            <span key={index} className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                              {skill}
                            </span>
                          ))}
                          {member.skills.length > 3 && (
                            <span className="bg-slate-700 text-slate-300 text-xs px-2 py-1 rounded">
                              +{member.skills.length - 3}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Действия */}
                      <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                        <button 
                          onClick={() => handleMemberClick(member)}
                          className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 text-sm transition-colors"
                        >
                          Профиль
                        </button>
                        <button 
                          onClick={() => {
                            setSelectedMember(member)
                            setShowEditForm(true)
                          }}
                          className="bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-600 text-sm transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="bg-slate-800 rounded-lg overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-slate-700">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Участник</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Роль</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Статус</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Проекты</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Эффективность</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Последняя активность</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Действия</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {filteredMembers.map((member) => {
                        const roleInfo = getRoleInfo(member.role)
                        const statusInfo = getStatusInfo(member.status)
                        
                        return (
                          <tr key={member.id} className="hover:bg-slate-700/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                                  {member.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="text-sm font-medium text-white">{member.name}</div>
                                  <div className="text-sm text-slate-400">{member.position}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${roleInfo.color}`}>
                                {roleInfo.name}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
                                {statusInfo.name}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-white">{member.projects}</td>
                            <td className="px-6 py-4">
                              <div className="flex items-center space-x-2">
                                <div className="w-16 bg-slate-700 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full"
                                    style={{ width: `${member.efficiency}%` }}
                                  ></div>
                                </div>
                                <span className="text-sm text-white">{member.efficiency}%</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-400">
                              {format(new Date(member.lastActive), 'dd MMM HH:mm', { locale: ru })}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex space-x-2">
                                <button className="text-blue-400 hover:text-blue-300 text-sm">
                                  Профиль
                                </button>
                                <button className="text-slate-400 hover:text-slate-300 text-sm">
                                  <Settings className="w-4 h-4" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {filteredMembers.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-500 mb-4">
                  <Users className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Участники не найдены</h3>
                <p className="text-slate-500 mb-4">Попробуйте изменить фильтры или пригласить новых участников</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Пригласить участника
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      {showInviteForm && (
        <InviteMemberForm
          onClose={() => setShowInviteForm(false)}
          onInvite={handleInviteMember}
        />
      )}

      {showEditForm && selectedMember && (
        <EditMemberForm
          member={selectedMember}
          onClose={() => {
            setShowEditForm(false)
            setSelectedMember(null)
          }}
          onSave={handleEditMember}
        />
      )}
    </div>
  )
}
