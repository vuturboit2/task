'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  User, 
  Bell, 
  Shield, 
  Palette,
  Globe,
  Save,
  X,
  Check,
  Moon,
  Sun,
  Monitor
} from 'lucide-react'

// Моковые данные настроек
const mockSettings = {
  profile: {
    name: 'Иван Петров',
    email: 'ivan.petrov@company.com',
    phone: '+7 (999) 123-45-67',
    bio: 'Опытный менеджер проектов с 5-летним стажем.',
    location: 'Москва, Россия',
    timezone: 'Europe/Moscow'
  },
  notifications: {
    email: {
      taskAssigned: true,
      taskCompleted: true,
      projectUpdates: true,
      teamMessages: false,
      weeklyReports: true
    },
    push: {
      taskDeadlines: true,
      urgentTasks: true,
      teamActivity: false,
      systemAlerts: true
    },
    sms: {
      urgentOnly: false,
      criticalAlerts: true
    }
  },
  privacy: {
    showEmail: true,
    showPhone: false,
    showBirthday: true,
    showLocation: true,
    showActivity: true,
    allowMessages: true
  },
  appearance: {
    theme: 'dark', // dark, light, auto
    language: 'ru',
    fontSize: 'medium', // small, medium, large
    compactMode: false
  },
  security: {
    twoFactorAuth: false,
    sessionTimeout: 30, // minutes
    loginNotifications: true,
    passwordExpiry: 90 // days
  }
}

export default function SettingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('profile')
  const [settings, setSettings] = useState(mockSettings)
  const [isEditing, setIsEditing] = useState(false)
  const [editForm, setEditForm] = useState(settings.profile)

  const handleSave = () => {
    setSettings(prev => ({ ...prev, profile: editForm }))
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditForm(settings.profile)
    setIsEditing(false)
  }

  const handleNotificationChange = (category: string, setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [category]: {
          ...prev.notifications[category as keyof typeof prev.notifications],
          [setting]: value
        }
      }
    }))
  }

  const handlePrivacyChange = (setting: string, value: boolean) => {
    setSettings(prev => ({
      ...prev,
      privacy: {
        ...prev.privacy,
        [setting]: value
      }
    }))
  }

  const handleAppearanceChange = (setting: string, value: string | boolean) => {
    setSettings(prev => ({
      ...prev,
      appearance: {
        ...prev.appearance,
        [setting]: value
      }
    }))
  }

  const handleSecurityChange = (setting: string, value: boolean | number) => {
    setSettings(prev => ({
      ...prev,
      security: {
        ...prev.security,
        [setting]: value
      }
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
                <span className="text-white font-bold text-lg">N</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-blue-400">Task Manager</h1>
              </div>
            </div>
            <p className="text-sm text-slate-400 mt-2">Настройки</p>
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
              <h3 className="text-sm font-medium text-slate-300 mb-2">Быстрые действия</h3>
              <div className="space-y-2 text-sm">
                <button className="w-full text-left text-blue-400 hover:text-blue-300">
                  Экспорт данных
                </button>
                <button className="w-full text-left text-blue-400 hover:text-blue-300">
                  Импорт настроек
                </button>
                <button className="w-full text-left text-red-400 hover:text-red-300">
                  Сбросить настройки
                </button>
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
                <h1 className="text-2xl font-bold text-white">Настройки</h1>
                <p className="text-slate-400">Управление профилем и предпочтениями</p>
              </div>
              {activeTab === 'profile' && (
                <div className="flex items-center space-x-3">
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
                    >
                      <User className="w-4 h-4" />
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
              )}
            </div>
          </header>

          {/* Навигация по вкладкам */}
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
            <div className="flex space-x-1">
              {[
                { id: 'profile', name: 'Профиль', icon: User },
                { id: 'notifications', name: 'Уведомления', icon: Bell },
                { id: 'privacy', name: 'Конфиденциальность', icon: Shield },
                { id: 'appearance', name: 'Внешний вид', icon: Palette },
                { id: 'security', name: 'Безопасность', icon: Shield }
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
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Личная информация</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Имя</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-slate-300">{settings.profile.name}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                        {isEditing ? (
                          <input
                            type="email"
                            value={editForm.email}
                            onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-slate-300">{settings.profile.email}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Телефон</label>
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm(prev => ({ ...prev, phone: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-slate-300">{settings.profile.phone}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Местоположение</label>
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.location}
                            onChange={(e) => setEditForm(prev => ({ ...prev, location: e.target.value }))}
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        ) : (
                          <p className="text-slate-300">{settings.profile.location}</p>
                        )}
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Часовой пояс</label>
                        <select className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                          <option value="Europe/Moscow">Москва (UTC+3)</option>
                          <option value="Europe/London">Лондон (UTC+0)</option>
                          <option value="America/New_York">Нью-Йорк (UTC-5)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <label className="block text-sm font-medium text-slate-300 mb-2">О себе</label>
                    {isEditing ? (
                      <textarea
                        value={editForm.bio}
                        onChange={(e) => setEditForm(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="text-slate-300">{settings.profile.bio}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Email уведомления</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications.email).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">
                            {key === 'taskAssigned' && 'Назначение задач'}
                            {key === 'taskCompleted' && 'Завершение задач'}
                            {key === 'projectUpdates' && 'Обновления проектов'}
                            {key === 'teamMessages' && 'Сообщения команды'}
                            {key === 'weeklyReports' && 'Еженедельные отчеты'}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {key === 'taskAssigned' && 'Получать уведомления о назначенных задачах'}
                            {key === 'taskCompleted' && 'Получать уведомления о завершенных задачах'}
                            {key === 'projectUpdates' && 'Получать уведомления об обновлениях проектов'}
                            {key === 'teamMessages' && 'Получать уведомления о сообщениях команды'}
                            {key === 'weeklyReports' && 'Получать еженедельные отчеты'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={value}
                            onChange={(e) => handleNotificationChange('email', key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Push уведомления</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.notifications.push).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">
                            {key === 'taskDeadlines' && 'Дедлайны задач'}
                            {key === 'urgentTasks' && 'Срочные задачи'}
                            {key === 'teamActivity' && 'Активность команды'}
                            {key === 'systemAlerts' && 'Системные уведомления'}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {key === 'taskDeadlines' && 'Получать уведомления о приближающихся дедлайнах'}
                            {key === 'urgentTasks' && 'Получать уведомления о срочных задачах'}
                            {key === 'teamActivity' && 'Получать уведомления об активности команды'}
                            {key === 'systemAlerts' && 'Получать системные уведомления'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={value}
                            onChange={(e) => handleNotificationChange('push', key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'privacy' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Настройки конфиденциальности</h3>
                  
                  <div className="space-y-4">
                    {Object.entries(settings.privacy).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between">
                        <div>
                          <h4 className="text-white font-medium">
                            {key === 'showEmail' && 'Показывать email'}
                            {key === 'showPhone' && 'Показывать телефон'}
                            {key === 'showBirthday' && 'Показывать день рождения'}
                            {key === 'showLocation' && 'Показывать местоположение'}
                            {key === 'showActivity' && 'Показывать активность'}
                            {key === 'allowMessages' && 'Разрешить сообщения'}
                          </h4>
                          <p className="text-slate-400 text-sm">
                            {key === 'showEmail' && 'Другие пользователи могут видеть ваш email'}
                            {key === 'showPhone' && 'Другие пользователи могут видеть ваш телефон'}
                            {key === 'showBirthday' && 'Другие пользователи могут видеть ваш день рождения'}
                            {key === 'showLocation' && 'Другие пользователи могут видеть ваше местоположение'}
                            {key === 'showActivity' && 'Другие пользователи могут видеть вашу активность'}
                            {key === 'allowMessages' && 'Разрешить другим пользователям отправлять вам сообщения'}
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input 
                            type="checkbox" 
                            className="sr-only peer" 
                            checked={value}
                            onChange={(e) => handlePrivacyChange(key, e.target.checked)}
                          />
                          <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Тема оформления</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'light', name: 'Светлая', icon: Sun },
                      { id: 'dark', name: 'Темная', icon: Moon },
                      { id: 'auto', name: 'Авто', icon: Monitor }
                    ].map((theme) => {
                      const Icon = theme.icon
                      return (
                        <button
                          key={theme.id}
                          onClick={() => handleAppearanceChange('theme', theme.id)}
                          className={`p-4 rounded-lg border-2 transition-colors ${
                            settings.appearance.theme === theme.id
                              ? 'border-blue-500 bg-blue-900/30'
                              : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                          }`}
                        >
                          <Icon className="w-6 h-6 mx-auto mb-2 text-slate-400" />
                          <p className="text-white font-medium">{theme.name}</p>
                        </button>
                      )
                    })}
                  </div>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Язык интерфейса</h3>
                  
                  <select 
                    value={settings.appearance.language}
                    onChange={(e) => handleAppearanceChange('language', e.target.value)}
                    className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="ru">Русский</option>
                    <option value="en">English</option>
                    <option value="de">Deutsch</option>
                    <option value="fr">Français</option>
                  </select>
                </div>
                
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Размер шрифта</h3>
                  
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { id: 'small', name: 'Малый', size: 'text-sm' },
                      { id: 'medium', name: 'Средний', size: 'text-base' },
                      { id: 'large', name: 'Большой', size: 'text-lg' }
                    ].map((size) => (
                      <button
                        key={size.id}
                        onClick={() => handleAppearanceChange('fontSize', size.id)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          settings.appearance.fontSize === size.id
                            ? 'border-blue-500 bg-blue-900/30'
                            : 'border-slate-600 bg-slate-700 hover:border-slate-500'
                        }`}
                      >
                        <p className={`text-white font-medium ${size.size}`}>{size.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className="space-y-6">
                <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                  <h3 className="text-xl font-semibold text-white mb-6">Безопасность</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Двухфакторная аутентификация</h4>
                        <p className="text-slate-400 text-sm">Дополнительная защита вашего аккаунта</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.security.twoFactorAuth}
                          onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                        />
                        <div className="w-11 h-6 bg-slate-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-white font-medium">Уведомления о входе</h4>
                        <p className="text-slate-400 text-sm">Получать уведомления о новых входах в аккаунт</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          className="sr-only peer" 
                          checked={settings.security.loginNotifications}
                          onChange={(e) => handleSecurityChange('loginNotifications', e.target.checked)}
                        />
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
