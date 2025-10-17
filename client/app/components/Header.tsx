'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Plus, Search, Check, X, Clock, AlertCircle, CheckCheck, User, Settings, LogOut, ChevronDown } from 'lucide-react'

interface HeaderProps {
  user: {
    id: string
    name: string
    email: string
    role: string
    avatar?: string
  }
  onAddTask: () => void
}

export default function Header({ user, onAddTask }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const notificationsRef = useRef<HTMLDivElement>(null)
  const profileRef = useRef<HTMLDivElement>(null)

  // Закрытие уведомлений и профиля при клике вне их
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
        setShowNotifications(false)
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Моковые данные уведомлений
  const notifications = [
    {
      id: '1',
      type: 'task_completed',
      title: 'Задача выполнена',
      message: 'Анна Смирнова завершила задачу "Обновить дизайн сайта"',
      time: '2 минуты назад',
      read: false,
      icon: Check,
      color: 'text-green-500'
    },
    {
      id: '2',
      type: 'task_overdue',
      title: 'Задача просрочена',
      message: 'Задача "Подготовить отчет" просрочена на 1 день',
      time: '1 час назад',
      read: false,
      icon: AlertCircle,
      color: 'text-red-500'
    },
    {
      id: '3',
      type: 'project_update',
      title: 'Обновление проекта',
      message: 'В проекте "Мобильное приложение" добавлена новая задача',
      time: '3 часа назад',
      read: true,
      icon: Clock,
      color: 'text-blue-500'
    },
    {
      id: '4',
      type: 'team_invite',
      title: 'Новый участник',
      message: 'Мария Козлова присоединилась к команде',
      time: '1 день назад',
      read: true,
      icon: Check,
      color: 'text-green-500'
    }
  ]

  const unreadCount = notifications.filter(n => !n.read).length

  const handleNotificationClick = (notificationId: string) => {
    // Здесь будет логика обработки клика по уведомлению
    console.log('Уведомление кликнуто:', notificationId)
  }

  const markAsRead = (notificationId: string) => {
    // Здесь будет логика отметки как прочитанное
    console.log('Отмечено как прочитанное:', notificationId)
  }

  const markAllAsRead = () => {
    // Здесь будет логика отметки всех как прочитанные
    console.log('Все уведомления отмечены как прочитанные')
  }

  const handleProfileAction = (action: string) => {
    setShowProfileMenu(false)
    switch (action) {
      case 'profile':
        window.location.href = '/profile'
        break
      case 'settings':
        window.location.href = '/settings'
        break
      case 'logout':
        // Здесь будет логика выхода
        console.log('Выход из системы')
        break
    }
  }

  return (
    <header className="bg-slate-800 shadow-sm border-b border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
            <Search className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={onAddTask}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Новая задача</span>
          </button>

          <div className="relative" ref={notificationsRef}>
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors relative"
            >
              <Bell className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Выпадающий список уведомлений */}
            {showNotifications && (
              <div className="absolute right-0 top-full mt-2 w-80 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                <div className="p-4 border-b border-slate-700">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-white">Уведомления</h3>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-blue-400 hover:text-blue-300 p-1"
                        title="Отметить все как прочитанные"
                      >
                        <CheckCheck className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="max-h-96 overflow-y-auto custom-scrollbar-dropdown">
                  {notifications.length === 0 ? (
                    <div className="p-6 text-center text-slate-400">
                      <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                      <p>Нет уведомлений</p>
                    </div>
                  ) : (
                    notifications.map((notification) => {
                      const Icon = notification.icon
                      return (
                        <div
                          key={notification.id}
                          className={`p-4 border-b border-slate-700 hover:bg-slate-700/50 transition-colors cursor-pointer ${
                            !notification.read ? 'bg-slate-700/30' : ''
                          }`}
                          onClick={() => handleNotificationClick(notification.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-full bg-slate-600 ${notification.color}`}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h4 className="text-white font-medium text-sm">{notification.title}</h4>
                                  <p className="text-slate-300 text-sm mt-1">{notification.message}</p>
                                  <p className="text-slate-400 text-xs mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && (
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      markAsRead(notification.id)
                                    }}
                                    className="p-1 text-slate-400 hover:text-white transition-colors"
                                  >
                                    <X className="w-3 h-3" />
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>

                <div className="p-4 border-t border-slate-700">
                  <button 
                    onClick={() => {
                      setShowNotifications(false)
                      window.location.href = '/notifications'
                    }}
                    className="w-full text-center text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Показать все уведомления
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="relative" ref={profileRef}>
            <button 
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-slate-700/50 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  user.name.charAt(0).toUpperCase()
                )}
              </div>
              <div className="text-left">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-slate-400 capitalize">{user.role.toLowerCase()}</p>
              </div>
              <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>

              {/* Выпадающее меню профиля */}
              {showProfileMenu && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-slate-800 rounded-lg shadow-xl border border-slate-700 z-50">
                  {/* Меню действий */}
                  <div className="py-2">
                    <button
                      onClick={() => handleProfileAction('profile')}
                      className="w-full flex items-center px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      <User className="w-5 h-5 mr-3" />
                      <span>Профиль</span>
                    </button>
                    
                    <button
                      onClick={() => handleProfileAction('settings')}
                      className="w-full flex items-center px-4 py-3 text-left text-slate-300 hover:bg-slate-700/50 transition-colors"
                    >
                      <Settings className="w-5 h-5 mr-3" />
                      <span>Настройки</span>
                    </button>
                  </div>

                  {/* Разделитель */}
                  <div className="border-t border-slate-700"></div>

                  {/* Выход */}
                  <div className="py-2">
                    <button
                      onClick={() => handleProfileAction('logout')}
                      className="w-full flex items-center px-4 py-3 text-left text-red-400 hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut className="w-5 h-5 mr-3" />
                      <span>Выйти</span>
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </div>
    </header>
  )
}
