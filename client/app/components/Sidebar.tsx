'use client'

import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderOpen, 
  Users, 
  Settings,
  LogOut,
  User
} from 'lucide-react'
import { useAuth } from '../providers'

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const { logout } = useAuth()

  const menuItems = [
    { id: 'dashboard', label: 'Обзор', icon: LayoutDashboard },
    { id: 'tasks', label: 'Задачи', icon: CheckSquare },
    { id: 'projects', label: 'Проекты', icon: FolderOpen, href: '/projects' },
    { id: 'team', label: 'Команда', icon: Users },
    { id: 'settings', label: 'Настройки', icon: Settings },
  ]

  return (
    <div className="w-64 bg-slate-800 shadow-lg h-screen flex flex-col border-r border-slate-700">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold text-blue-400">Task Manager</h1>
        <p className="text-sm text-slate-400">Pro Edition</p>
      </div>

        <nav className="flex-1 p-4 custom-scrollbar-sidebar">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  onClick={() => {
                    if (item.href) {
                      window.location.href = item.href
                    } else {
                      setActiveTab(item.id)
                    }
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-900/50 text-blue-300 border-r-2 border-blue-400'
                      : 'text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  {item.label}
                </button>
              </li>
            )
          })}
          
          <li className="pt-4 border-t border-slate-700">
            <button
              onClick={() => window.location.href = '/profile'}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
            >
              <User className="w-5 h-5 mr-3" />
              Профиль
            </button>
          </li>
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="w-full flex items-center px-4 py-3 text-left text-red-400 hover:bg-red-900/20 rounded-lg transition-colors"
        >
          <LogOut className="w-5 h-5 mr-3" />
          Выйти
        </button>
      </div>
    </div>
  )
}
