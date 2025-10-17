'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  Calendar,
  MapPin,
  Briefcase,
  Award,
  Settings,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Users,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Upload,
  Bell,
  Lock,
  Globe,
  Github,
  Linkedin,
  Twitter,
  Instagram
} from 'lucide-react'
import { format } from 'date-fns'
import { ru } from 'date-fns/locale'

// Моковые данные пользователя
const mockUser = {
  id: '1',
  name: 'Иван Петров',
  email: 'ivan.petrov@company.com',
  role: 'Manager',
  avatar: null,
  phone: '+7 (999) 123-45-67',
  department: 'Разработка',
  position: 'Менеджер проектов',
  bio: 'Опытный менеджер проектов с 5-летним стажем. Специализируюсь на управлении IT-проектами и командами разработки.',
  location: 'Москва, Россия',
  birthday: '1985-06-15',
  hireDate: '2020-03-01',
  skills: [
    { name: 'Управление проектами', level: 95, category: 'Управление' },
    { name: 'Agile/Scrum', level: 90, category: 'Методологии' },
    { name: 'JavaScript', level: 75, category: 'Технологии' },
    { name: 'React', level: 70, category: 'Технологии' },
    { name: 'Node.js', level: 65, category: 'Технологии' },
    { name: 'Командная работа', level: 95, category: 'Soft Skills' },
    { name: 'Презентации', level: 85, category: 'Soft Skills' }
  ],
  achievements: [
    {
      id: '1',
      title: 'Лучший менеджер месяца',
      description: 'За успешное завершение проекта CRM системы',
      date: '2024-10-01',
      type: 'award'
    },
    {
      id: '2',
      title: 'Сертификация PMP',
      description: 'Получен сертификат Project Management Professional',
      date: '2024-08-15',
      type: 'certification'
    },
    {
      id: '3',
      title: 'Повышение эффективности команды на 30%',
      description: 'Внедрение новых процессов управления',
      date: '2024-06-01',
      type: 'achievement'
    }
  ],
  socialLinks: {
    linkedin: 'https://linkedin.com/in/ivanpetrov',
    github: 'https://github.com/ivanpetrov',
    twitter: 'https://twitter.com/ivanpetrov'
  },
  preferences: {
    notifications: {
      email: true,
      push: true,
      sms: false
    },
    privacy: {
      showEmail: true,
      showPhone: false,
      showBirthday: true
    },
    theme: 'dark',
    language: 'ru'
  },
  stats: {
    tasksCompleted: 156,
    projectsManaged: 23,
    teamMembers: 12,
    efficiency: 94,
    rating: 4.8,
    workingHours: 40
  },
  recentActivity: [
    {
      id: '1',
      action: 'Завершил задачу',
      description: 'Обновить дизайн сайта',
      time: '2 часа назад',
      type: 'task_completed'
    },
    {
      id: '2',
      action: 'Создал проект',
      description: 'Мобильное приложение',
      time: '1 день назад',
      type: 'project_created'
    },
    {
      id: '3',
      action: 'Добавил участника',
      description: 'Анна Смирнова в команду',
      time: '2 дня назад',
      type: 'team_member_added'
    }
  ]
}

const skillCategories = [
  { id: 'all', name: 'Все', color: 'bg-slate-600' },
  { id: 'Управление', name: 'Управление', color: 'bg-blue-600' },
  { id: 'Методологии', name: 'Методологии', color: 'bg-green-600' },
  { id: 'Технологии', name: 'Технологии', color: 'bg-purple-600' },
  { id: 'Soft Skills', name: 'Soft Skills', color: 'bg-orange-600' }
]

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState(mockUser)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('all')
  const [editForm, setEditForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    bio: user.bio,
    location: user.location,
    department: user.department,
    position: user.position
  })

  const handleSave = () => {
    setUser(prev => ({ ...prev, ...editForm }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm({
      name: user.name,
      email: user.email,
      phone: user.phone,
      bio: user.bio,
      location: user.location,
      department: user.department,
      position: user.position
    })
    setIsEditing(false)
  }

  const filteredSkills = selectedSkillCategory === 'all' 
    ? user.skills 
    : user.skills.filter(skill => skill.category === selectedSkillCategory)

  const getRoleColor = (role: string) => {
    const colors = {
      'Admin': 'bg-red-100 text-red-800',
      'Manager': 'bg-blue-100 text-blue-800',
      'Developer': 'bg-green-100 text-green-800',
      'Designer': 'bg-purple-100 text-purple-800',
      'Analyst': 'bg-yellow-100 text-yellow-800'
    }
    return colors[role as keyof typeof colors] || 'bg-gray-100 text-gray-800'
  }

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'award': return Award
      case 'certification': return Shield
      case 'achievement': return Star
      default: return Award
    }
  }

  const getAchievementColor = (type: string) => {
    switch (type) {
      case 'award': return 'text-yellow-500'
      case 'certification': return 'text-blue-500'
      case 'achievement': return 'text-green-500'
      default: return 'text-gray-500'
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
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Профиль</p>
          </div>

          <nav className="flex-1 p-4 custom-scrollbar-sidebar">
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
                  <span className="text-slate-400">Задач выполнено:</span>
                  <span className="text-white">{user.stats.tasksCompleted}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Проектов:</span>
                  <span className="text-white">{user.stats.projectsManaged}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Эффективность:</span>
                  <span className="text-white">{user.stats.efficiency}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Рейтинг:</span>
                  <span className="text-white">{user.stats.rating}/5</span>
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
                <h1 className="text-2xl font-bold text-white">Личный профиль</h1>
                <p className="text-slate-400">Управление профилем и настройками</p>
              </div>
              <div className="flex items-center space-x-3">
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Редактировать</span>
                  </button>
                ) : (
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={handleSave}
                      className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2 transition-colors"
                    >
                      <Save className="w-4 h-4" />
                      <span>Сохранить</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="bg-slate-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 flex items-center space-x-2 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      <span>Отмена</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Навигация по вкладкам */}
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
            <div className="flex space-x-1">
              {[
                { id: 'overview', name: 'Обзор', icon: User },
                { id: 'skills', name: 'Навыки', icon: Award },
                { id: 'achievements', name: 'Достижения', icon: Star },
                { id: 'activity', name: 'Активность', icon: BarChart3 },
                { id: 'settings', name: 'Настройки', icon: Settings }
              ].map((tab) => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-300 hover:bg-slate-700/50'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{tab.name}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Контент */}
          <main className="flex-1 p-6 custom-scrollbar">
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Основная информация */}
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-start space-x-6">
                    <div className="relative">
                      <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                        {user.avatar ? (
                          <img 
                            src={user.avatar} 
                            alt={user.name}
                            className="w-24 h-24 rounded-full object-cover"
                          />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      {isEditing && (
                        <button className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 transition-colors">
                          <Camera className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="text-2xl font-bold text-white bg-slate-700 border border-slate-600 rounded-lg px-3 py-1"
                          />
                        ) : (
                          <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        )}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleColor(user.role)}`}>
                          {user.role}
                        </span>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Mail className="w-5 h-5 text-slate-400" />
                            {isEditing ? (
                              <input
                                type="email"
                                value={editForm.email}
                                onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                                className="text-slate-300 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 flex-1"
                              />
                            ) : (
                              <span className="text-slate-300">{user.email}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Phone className="w-5 h-5 text-slate-400" />
                            {isEditing ? (
                              <input
                                type="tel"
                                value={editForm.phone}
                                onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                                className="text-slate-300 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 flex-1"
                              />
                            ) : (
                              <span className="text-slate-300">{user.phone}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <MapPin className="w-5 h-5 text-slate-400" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.location}
                                onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                                className="text-slate-300 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 flex-1"
                              />
                            ) : (
                              <span className="text-slate-300">{user.location}</span>
                            )}
                          </div>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex items-center space-x-3">
                            <Briefcase className="w-5 h-5 text-slate-400" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.department}
                                onChange={(e) => setEditForm(prev => ({ ...prev, department: e.target.value }))}
                                className="text-slate-300 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 flex-1"
                              />
                            ) : (
                              <span className="text-slate-300">{user.department}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <User className="w-5 h-5 text-slate-400" />
                            {isEditing ? (
                              <input
                                type="text"
                                value={editForm.position}
                                onChange={(e) => setEditForm(prev => ({ ...prev, position: e.target.value }))}
                                className="text-slate-300 bg-slate-700 border border-slate-600 rounded-lg px-3 py-1 flex-1"
                              />
                            ) : (
                              <span className="text-slate-300">{user.position}</span>
                            )}
                          </div>
                          
                          <div className="flex items-center space-x-3">
                            <Calendar className="w-5 h-5 text-slate-400" />
                            <span className="text-slate-300">
                              Работает с {format(new Date(user.hireDate), 'MMMM yyyy', { locale: ru })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <h3 className="text-lg font-semibold text-white mb-3">О себе</h3>
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full text-slate-300 bg-slate-700 border border-slate-600 rounded-lg px-3 py-2"
                      />
                    ) : (
                      <p className="text-slate-300">{user.bio}</p>
                    )}
                  </div>
                </div>

                {/* Статистика */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-300">Задач выполнено</p>
                        <p className="text-3xl font-bold text-white">{user.stats.tasksCompleted}</p>
                      </div>
                      <div className="p-3 rounded-full bg-green-900/30">
                        <CheckCircle className="w-6 h-6 text-green-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-300">Проектов</p>
                        <p className="text-3xl font-bold text-white">{user.stats.projectsManaged}</p>
                      </div>
                      <div className="p-3 rounded-full bg-blue-900/30">
                        <Briefcase className="w-6 h-6 text-blue-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-300">Эффективность</p>
                        <p className="text-3xl font-bold text-white">{user.stats.efficiency}%</p>
                      </div>
                      <div className="p-3 rounded-full bg-yellow-900/30">
                        <BarChart3 className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-300">Рейтинг</p>
                        <p className="text-3xl font-bold text-white">{user.stats.rating}/5</p>
                      </div>
                      <div className="p-3 rounded-full bg-purple-900/30">
                        <Star className="w-6 h-6 text-purple-400" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-white">Навыки и компетенции</h3>
                    <div className="flex space-x-2">
                      {skillCategories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => setSelectedSkillCategory(category.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                            selectedSkillCategory === category.id
                              ? `${category.color} text-white`
                              : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                          }`}
                        >
                          {category.name}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    {filteredSkills.map((skill, index) => (
                      <div key={index} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-white font-medium">{skill.name}</h4>
                          <span className="text-slate-400 text-sm">{skill.level}%</span>
                        </div>
                        <div className="w-full bg-slate-600 rounded-full h-2">
                          <div 
                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${skill.level}%` }}
                          ></div>
                        </div>
                        <p className="text-slate-400 text-sm mt-1">{skill.category}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Достижения и награды</h3>
                  
                  <div className="space-y-4">
                    {user.achievements.map((achievement) => {
                      const Icon = getAchievementIcon(achievement.type)
                      return (
                        <div key={achievement.id} className="bg-slate-700 rounded-lg p-4">
                          <div className="flex items-start space-x-4">
                            <div className={`p-3 rounded-full bg-slate-600 ${getAchievementColor(achievement.type)}`}>
                              <Icon className="w-6 h-6" />
                            </div>
                            <div className="flex-1">
                              <h4 className="text-white font-medium">{achievement.title}</h4>
                              <p className="text-slate-300 mt-1">{achievement.description}</p>
                              <p className="text-slate-400 text-sm mt-2">
                                {format(new Date(achievement.date), 'dd MMMM yyyy', { locale: ru })}
                              </p>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Последняя активность</h3>
                  
                  <div className="space-y-4">
                    {user.recentActivity.map((activity) => (
                      <div key={activity.id} className="bg-slate-700 rounded-lg p-4">
                        <div className="flex items-start space-x-4">
                          <div className="p-2 rounded-full bg-slate-600">
                            <Clock className="w-4 h-4 text-slate-400" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-white font-medium">{activity.action}</h4>
                            <p className="text-slate-300 mt-1">{activity.description}</p>
                            <p className="text-slate-400 text-sm mt-2">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Настройки уведомлений</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Email уведомления</h4>
                        <p className="text-slate-400 text-sm">Получать уведомления на email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={user.preferences.notifications.email} />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Push уведомления</h4>
                        <p className="text-slate-400 text-sm">Получать push уведомления в браузере</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={user.preferences.notifications.push} />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">SMS уведомления</h4>
                        <p className="text-slate-400 text-sm">Получать уведомления по SMS</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={user.preferences.notifications.sms} />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Настройки конфиденциальности</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Показывать email</h4>
                        <p className="text-slate-400 text-sm">Другие пользователи могут видеть ваш email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={user.preferences.privacy.showEmail} />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Показывать телефон</h4>
                        <p className="text-slate-400 text-sm">Другие пользователи могут видеть ваш телефон</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={user.preferences.privacy.showPhone} />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
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
