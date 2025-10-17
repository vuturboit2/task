'use client'

import { CheckCircle, Clock, AlertCircle, Users } from 'lucide-react'

interface StatsCardsProps {
  tasks: Array<{
    status: string
    priority: string
    dueDate?: string
  }>
}

export default function StatsCards({ tasks }: StatsCardsProps) {
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'DONE').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    overdue: tasks.filter(t => {
      if (!t.dueDate) return false
      return new Date(t.dueDate) < new Date() && t.status !== 'DONE'
    }).length,
    urgent: tasks.filter(t => t.priority === 'URGENT').length
  }

  const cards = [
    {
      title: 'Всего задач',
      value: stats.total,
      icon: CheckCircle,
      color: 'text-blue-400',
      bgColor: 'bg-blue-900/30'
    },
    {
      title: 'Выполнено',
      value: stats.completed,
      icon: CheckCircle,
      color: 'text-green-400',
      bgColor: 'bg-green-900/30'
    },
    {
      title: 'В работе',
      value: stats.inProgress,
      icon: Clock,
      color: 'text-yellow-400',
      bgColor: 'bg-yellow-900/30'
    },
    {
      title: 'Просрочено',
      value: stats.overdue,
      icon: AlertCircle,
      color: 'text-red-400',
      bgColor: 'bg-red-900/30'
    }
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, index) => {
        const Icon = card.icon
        return (
          <div key={index} className="bg-slate-800 rounded-lg shadow-sm p-6 border border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-300">{card.title}</p>
                <p className="text-3xl font-bold text-white">{card.value}</p>
              </div>
              <div className={`p-3 rounded-full ${card.bgColor}`}>
                <Icon className={`w-6 h-6 ${card.color}`} />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
