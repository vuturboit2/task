'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../providers'
import Sidebar from './Sidebar'
import Header from './Header'
import TaskList from './TaskList'
import TaskForm from './TaskForm'
import StatsCards from './StatsCards'
import RecentActivity from './RecentActivity'
import { mockTasks, mockUser, mockStats } from './MockData'
import toast from 'react-hot-toast'

interface Task {
  id: string
  title: string
  description?: string
  status: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE' | 'CANCELLED'
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
  creator: {
    id: string
    name: string
    avatar?: string
  }
  assignee?: {
    id: string
    name: string
    avatar?: string
  }
  watchers: Array<{
    id: string
    name: string
    avatar?: string
  }>
}

export default function Dashboard() {
  const { user, socket } = useAuth()
  const [activeTab, setActiveTab] = useState('tasks')
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [loading, setLoading] = useState(false)
  const [showTaskForm, setShowTaskForm] = useState(false)

  useEffect(() => {
    // Используем моковые данные для демонстрации
    setLoading(false)
    
    if (socket) {
      socket.on('task-created', (task: Task) => {
        setTasks(prev => [task, ...prev])
        toast.success('Новая задача создана!')
      })

      socket.on('task-updated', (task: Task) => {
        setTasks(prev => prev.map(t => t.id === task.id ? task : t))
        toast.success('Задача обновлена!')
      })

      socket.on('task-deleted', ({ id }: { id: string }) => {
        setTasks(prev => prev.filter(t => t.id !== id))
        toast.success('Задача удалена!')
      })

      return () => {
        socket.off('task-created')
        socket.off('task-updated')
        socket.off('task-deleted')
      }
    }
  }, [socket])

  const handleTaskCreate = (task: Task) => {
    setTasks(prev => [task, ...prev])
    setShowTaskForm(false)
  }

  const handleTaskUpdate = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t))
  }

  const handleTaskDelete = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="flex">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <div className="flex-1 flex flex-col">
          <Header 
            user={user} 
            onAddTask={() => setShowTaskForm(true)}
          />
          
          <main className="flex-1 p-6">
            {activeTab === 'dashboard' && (
              <div className="space-y-6">
                <StatsCards tasks={tasks} />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <TaskList 
                    tasks={tasks} 
                    onUpdate={handleTaskUpdate}
                    onDelete={handleTaskDelete}
                  />
                  <RecentActivity />
                </div>
              </div>
            )}
            
            {activeTab === 'tasks' && (
              <TaskList 
                tasks={tasks} 
                onUpdate={handleTaskUpdate}
                onDelete={handleTaskDelete}
                showCreateButton
                onCreateTask={() => setShowTaskForm(true)}
              />
            )}
            
            {activeTab === 'projects' && (
              <div className="bg-slate-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Проекты</h2>
                <p className="text-slate-400 mb-4">Управление проектами и командами</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Активные проекты</h3>
                    <p className="text-3xl font-bold text-blue-400 mb-1">3</p>
                    <p className="text-slate-400 text-sm">в работе</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Завершенные</h3>
                    <p className="text-3xl font-bold text-green-400 mb-1">12</p>
                    <p className="text-slate-400 text-sm">в этом месяце</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Команда</h3>
                    <p className="text-3xl font-bold text-purple-400 mb-1">8</p>
                    <p className="text-slate-400 text-sm">участников</p>
                  </div>
                </div>
                <div className="mt-4 flex space-x-3">
                  <button
                    onClick={() => window.location.href = '/projects'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Управление проектами
                  </button>
                  <button
                    onClick={() => window.location.href = '/projects/templates'}
                    className="bg-slate-700 text-white px-4 py-2 rounded-lg hover:bg-slate-600 transition-colors"
                  >
                    Шаблоны
                  </button>
                </div>
              </div>
            )}
            
            {activeTab === 'team' && (
              <div className="bg-slate-800 rounded-lg shadow p-6">
                <h2 className="text-2xl font-bold text-white mb-4">Команда</h2>
                <p className="text-slate-400 mb-4">Управление командой и участниками</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Участники</h3>
                    <p className="text-3xl font-bold text-blue-400 mb-1">12</p>
                    <p className="text-slate-400 text-sm">активных</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Роли</h3>
                    <p className="text-3xl font-bold text-green-400 mb-1">5</p>
                    <p className="text-slate-400 text-sm">разных ролей</p>
                  </div>
                  <div className="bg-slate-700 rounded-lg p-4">
                    <h3 className="text-white font-semibold mb-2">Активность</h3>
                    <p className="text-3xl font-bold text-purple-400 mb-1">85%</p>
                    <p className="text-slate-400 text-sm">средняя</p>
                  </div>
                </div>
                <div className="mt-4">
                  <button 
                    onClick={() => window.location.href = '/team'}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Управление командой
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {showTaskForm && (
        <TaskForm 
          onClose={() => setShowTaskForm(false)}
          onTaskCreate={handleTaskCreate}
        />
      )}
    </div>
  )
}
