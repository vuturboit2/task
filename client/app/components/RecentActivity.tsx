'use client'

import { Activity, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

export default function RecentActivity() {
  const activities = [
    {
      id: 1,
      type: 'task_created',
      message: 'Создана новая задача "Обновить дизайн"',
      time: '2 минуты назад',
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'task_updated',
      message: 'Задача "Исправить баг" переведена в статус "В работе"',
      time: '15 минут назад',
      icon: Clock,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'task_overdue',
      message: 'Задача "Подготовить отчет" просрочена',
      time: '1 час назад',
      icon: AlertTriangle,
      color: 'text-red-600'
    },
    {
      id: 4,
      type: 'task_completed',
      message: 'Задача "Настроить сервер" выполнена',
      time: '2 часа назад',
      icon: CheckCircle,
      color: 'text-green-600'
    }
  ]

  return (
    <div className="bg-slate-800 rounded-lg shadow">
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center space-x-2">
          <Activity className="w-5 h-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Последняя активность</h2>
        </div>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          {activities.map((activity) => {
            const Icon = activity.icon
            return (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className={`p-2 rounded-full bg-slate-700 ${activity.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-white">{activity.message}</p>
                  <p className="text-xs text-slate-400 mt-1">{activity.time}</p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-700">
          <button className="text-blue-400 hover:text-blue-300 text-sm font-medium">
            Показать все уведомления
          </button>
        </div>
      </div>
    </div>
  )
}
