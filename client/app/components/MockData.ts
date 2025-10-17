// Моковые данные для демонстрации без базы данных
export const mockTasks = [
  {
    id: '1',
    title: 'Обновить дизайн сайта',
    description: 'Необходимо обновить дизайн главной страницы согласно новому брендбуку',
    status: 'IN_PROGRESS' as const,
    priority: 'HIGH' as const,
    dueDate: '2024-12-25T00:00:00Z',
    createdAt: '2024-12-15T10:00:00Z',
    creator: {
      id: '1',
      name: 'Иван Петров',
      avatar: undefined
    },
    assignee: {
      id: '2',
      name: 'Анна Смирнова',
      avatar: undefined
    },
    watchers: [
      { id: '3', name: 'Петр Иванов', avatar: undefined },
      { id: '4', name: 'Мария Козлова', avatar: undefined }
    ]
  },
  {
    id: '2',
    title: 'Исправить баг в авторизации',
    description: 'Пользователи не могут войти в систему через социальные сети',
    status: 'DONE' as const,
    priority: 'MEDIUM' as const,
    dueDate: '2024-12-20T00:00:00Z',
    createdAt: '2024-12-10T14:30:00Z',
    creator: {
      id: '1',
      name: 'Иван Петров',
      avatar: undefined
    },
    assignee: {
      id: '3',
      name: 'Петр Иванов',
      avatar: undefined
    },
    watchers: [
      { id: '2', name: 'Анна Смирнова', avatar: undefined }
    ]
  },
  {
    id: '3',
    title: 'Подготовить отчет',
    description: 'Ежемесячный отчет по продажам для руководства',
    status: 'TODO' as const,
    priority: 'URGENT' as const,
    dueDate: '2024-12-15T00:00:00Z',
    createdAt: '2024-12-05T09:15:00Z',
    creator: {
      id: '1',
      name: 'Иван Петров',
      avatar: undefined
    },
    assignee: {
      id: '4',
      name: 'Мария Козлова',
      avatar: undefined
    },
    watchers: [
      { id: '2', name: 'Анна Смирнова', avatar: undefined },
      { id: '3', name: 'Петр Иванов', avatar: undefined }
    ]
  },
  {
    id: '4',
    title: 'Настроить сервер',
    description: 'Настройка нового сервера для продакшена',
    status: 'DONE' as const,
    priority: 'HIGH' as const,
    dueDate: '2024-12-18T00:00:00Z',
    createdAt: '2024-12-12T11:20:00Z',
    creator: {
      id: '1',
      name: 'Иван Петров',
      avatar: undefined
    },
    assignee: {
      id: '3',
      name: 'Петр Иванов',
      avatar: undefined
    },
    watchers: []
  }
]

export const mockUser = {
  id: '1',
  name: 'Иван Петров',
  email: 'ivan@example.com',
  role: 'MANAGER',
  avatar: undefined
}

export const mockStats = {
  total: 4,
  completed: 2,
  inProgress: 1,
  overdue: 1,
  urgent: 1
}
