'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ArrowLeft, 
  Plus, 
  Search, 
  Filter,
  Clock,
  Users,
  Target,
  CheckCircle,
  Star,
  Copy,
  Eye
} from 'lucide-react'

// Моковые данные для шаблонов проектов
const mockTemplates = [
  {
    id: '1',
    name: 'Веб-разработка',
    description: 'Полный цикл разработки веб-приложения с фронтендом и бэкендом',
    category: 'Разработка',
    difficulty: 'Средний',
    duration: '3-6 месяцев',
    teamSize: '3-5 человек',
    tasks: 25,
    milestones: 5,
    isPopular: true,
    rating: 4.8,
    uses: 1247,
    tags: ['React', 'Node.js', 'PostgreSQL', 'API'],
    estimatedHours: 480,
    phases: [
      { name: 'Планирование', duration: '1-2 недели', tasks: 5 },
      { name: 'Дизайн', duration: '2-3 недели', tasks: 8 },
      { name: 'Разработка', duration: '8-12 недель', tasks: 10 },
      { name: 'Тестирование', duration: '2-3 недели', tasks: 2 }
    ]
  },
  {
    id: '2',
    name: 'Мобильное приложение',
    description: 'Создание кроссплатформенного мобильного приложения',
    category: 'Мобильная разработка',
    difficulty: 'Высокий',
    duration: '4-8 месяцев',
    teamSize: '4-6 человек',
    tasks: 35,
    milestones: 6,
    isPopular: true,
    rating: 4.9,
    uses: 892,
    tags: ['React Native', 'Firebase', 'API', 'UI/UX'],
    estimatedHours: 720,
    phases: [
      { name: 'Исследование', duration: '1-2 недели', tasks: 3 },
      { name: 'Прототипирование', duration: '2-3 недели', tasks: 6 },
      { name: 'Разработка', duration: '12-16 недель', tasks: 20 },
      { name: 'Тестирование', duration: '3-4 недели', tasks: 4 },
      { name: 'Публикация', duration: '1-2 недели', tasks: 2 }
    ]
  },
  {
    id: '3',
    name: 'E-commerce платформа',
    description: 'Создание интернет-магазина с полным функционалом',
    category: 'E-commerce',
    difficulty: 'Высокий',
    duration: '6-12 месяцев',
    teamSize: '5-8 человек',
    tasks: 45,
    milestones: 8,
    isPopular: false,
    rating: 4.7,
    uses: 634,
    tags: ['Shopify', 'Payment', 'Inventory', 'Analytics'],
    estimatedHours: 1200,
    phases: [
      { name: 'Анализ требований', duration: '2-3 недели', tasks: 8 },
      { name: 'Дизайн системы', duration: '3-4 недели', tasks: 12 },
      { name: 'Разработка', duration: '16-20 недель', tasks: 20 },
      { name: 'Интеграции', duration: '4-6 недель', tasks: 8 },
      { name: 'Тестирование', duration: '4-6 недель', tasks: 5 },
      { name: 'Запуск', duration: '2-3 недели', tasks: 2 }
    ]
  },
  {
    id: '4',
    name: 'Корпоративный портал',
    description: 'Внутренний портал для управления бизнес-процессами',
    category: 'Корпоративные решения',
    difficulty: 'Средний',
    duration: '2-4 месяца',
    teamSize: '3-4 человека',
    tasks: 20,
    milestones: 4,
    isPopular: false,
    rating: 4.5,
    uses: 423,
    tags: ['Intranet', 'Workflow', 'CRM', 'Reporting'],
    estimatedHours: 320,
    phases: [
      { name: 'Анализ процессов', duration: '1-2 недели', tasks: 4 },
      { name: 'Разработка', duration: '6-8 недель', tasks: 12 },
      { name: 'Интеграция', duration: '2-3 недели', tasks: 3 },
      { name: 'Внедрение', duration: '1-2 недели', tasks: 1 }
    ]
  },
  {
    id: '5',
    name: 'Маркетинговая кампания',
    description: 'Комплексная маркетинговая кампания с аналитикой',
    category: 'Маркетинг',
    difficulty: 'Низкий',
    duration: '1-2 месяца',
    teamSize: '2-3 человека',
    tasks: 15,
    milestones: 3,
    isPopular: true,
    rating: 4.6,
    uses: 756,
    tags: ['SEO', 'Social Media', 'Content', 'Analytics'],
    estimatedHours: 160,
    phases: [
      { name: 'Планирование', duration: '1 неделя', tasks: 5 },
      { name: 'Реализация', duration: '3-4 недели', tasks: 8 },
      { name: 'Анализ', duration: '1 неделя', tasks: 2 }
    ]
  },
  {
    id: '6',
    name: 'Система управления контентом',
    description: 'CMS для управления веб-сайтом и контентом',
    category: 'Разработка',
    difficulty: 'Средний',
    duration: '3-5 месяцев',
    teamSize: '3-4 человека',
    tasks: 28,
    milestones: 5,
    isPopular: false,
    rating: 4.4,
    uses: 312,
    tags: ['CMS', 'Admin Panel', 'Content', 'Media'],
    estimatedHours: 400,
    phases: [
      { name: 'Архитектура', duration: '1-2 недели', tasks: 6 },
      { name: 'Разработка', duration: '8-10 недель', tasks: 18 },
      { name: 'Тестирование', duration: '2-3 недели', tasks: 4 }
    ]
  }
]

const categories = ['Все', 'Разработка', 'Мобильная разработка', 'E-commerce', 'Корпоративные решения', 'Маркетинг']
const difficulties = ['Все', 'Низкий', 'Средний', 'Высокий']

export default function TemplatesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Все')
  const [selectedDifficulty, setSelectedDifficulty] = useState('Все')
  const [sortBy, setSortBy] = useState('popular')

  const filteredTemplates = mockTemplates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'Все' || template.category === selectedCategory
    const matchesDifficulty = selectedDifficulty === 'Все' || template.difficulty === selectedDifficulty
    
    return matchesSearch && matchesCategory && matchesDifficulty
  })

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    switch (sortBy) {
      case 'popular':
        return b.uses - a.uses
      case 'rating':
        return b.rating - a.rating
      case 'name':
        return a.name.localeCompare(b.name)
      case 'duration':
        return a.duration.localeCompare(b.duration)
      default:
        return 0
    }
  })

  const handleUseTemplate = (templateId: string) => {
    // Здесь будет логика создания проекта из шаблона
    router.push(`/projects/new?template=${templateId}`)
  }

  const handlePreviewTemplate = (templateId: string) => {
    router.push(`/projects/templates/${templateId}`)
  }

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
            <p className="text-sm text-slate-400 mt-2">Шаблоны проектов</p>
          </div>

          <nav className="flex-1 p-4">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => router.push('/projects')}
                  className="w-full flex items-center px-4 py-3 text-left rounded-lg text-slate-300 hover:bg-slate-700/50 transition-colors"
                >
                  <ArrowLeft className="w-5 h-5 mr-3" />
                  Назад к проектам
                </button>
              </li>
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-700">
            <div className="bg-slate-700 rounded-lg p-4">
              <h3 className="text-sm font-medium text-slate-300 mb-2">Статистика</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-slate-400">Шаблонов:</span>
                  <span className="text-white">{mockTemplates.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Популярных:</span>
                  <span className="text-white">{mockTemplates.filter(t => t.isPopular).length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">Использований:</span>
                  <span className="text-white">{mockTemplates.reduce((sum, t) => sum + t.uses, 0)}</span>
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
                <h1 className="text-2xl font-bold text-white">Шаблоны проектов</h1>
                <p className="text-slate-400">Готовые шаблоны для быстрого старта</p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 transition-colors">
                  <Plus className="w-4 h-4" />
                  <span>Создать шаблон</span>
                </button>
              </div>
            </div>
          </header>

          {/* Фильтры и поиск */}
          <div className="bg-slate-800 border-b border-slate-700 px-6 py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="relative flex-1 min-w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Поиск шаблонов..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
              
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {difficulties.map(difficulty => (
                  <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
              </select>
              
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="popular">Популярность</option>
                <option value="rating">Рейтинг</option>
                <option value="name">Название</option>
                <option value="duration">Длительность</option>
              </select>
            </div>
          </div>

          {/* Список шаблонов */}
          <main className="flex-1 p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedTemplates.map((template) => (
                <div key={template.id} className="bg-slate-800 rounded-lg p-6 hover:bg-slate-750 transition-colors">
                  {/* Заголовок */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-white">{template.name}</h3>
                        {template.isPopular && (
                          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-medium">
                            <Star className="w-3 h-3 inline mr-1" />
                            Популярный
                          </span>
                        )}
                      </div>
                      <p className="text-slate-400 text-sm mb-3 line-clamp-2">{template.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{template.duration}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Users className="w-3 h-3" />
                          <span>{template.teamSize}</span>
                        </span>
                        <span className="flex items-center space-x-1">
                          <Target className="w-3 h-3" />
                          <span>{template.tasks} задач</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Теги */}
                  <div className="flex flex-wrap gap-1 mb-4">
                    {template.tags.slice(0, 3).map((tag, index) => (
                      <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                        {tag}
                      </span>
                    ))}
                    {template.tags.length > 3 && (
                      <span className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded">
                        +{template.tags.length - 3}
                      </span>
                    )}
                  </div>

                  {/* Статистика */}
                  <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-white">{template.rating}</div>
                      <div className="text-xs text-slate-400">Рейтинг</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{template.uses}</div>
                      <div className="text-xs text-slate-400">Использований</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-white">{template.estimatedHours}ч</div>
                      <div className="text-xs text-slate-400">Часов</div>
                    </div>
                  </div>

                  {/* Этапы */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-slate-300 mb-2">Этапы ({template.milestones})</h4>
                    <div className="space-y-1">
                      {template.phases.slice(0, 3).map((phase, index) => (
                        <div key={index} className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">{phase.name}</span>
                          <span className="text-slate-500">{phase.duration}</span>
                        </div>
                      ))}
                      {template.phases.length > 3 && (
                        <div className="text-xs text-slate-500">
                          +{template.phases.length - 3} этапов
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Действия */}
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUseTemplate(template.id)}
                      className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 flex items-center justify-center space-x-2 transition-colors text-sm"
                    >
                      <Copy className="w-4 h-4" />
                      <span>Использовать</span>
                    </button>
                    <button
                      onClick={() => handlePreviewTemplate(template.id)}
                      className="bg-slate-700 text-white px-3 py-2 rounded-lg hover:bg-slate-600 flex items-center justify-center transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {sortedTemplates.length === 0 && (
              <div className="text-center py-12">
                <div className="text-slate-500 mb-4">
                  <Target className="w-16 h-16 mx-auto mb-4" />
                </div>
                <h3 className="text-lg font-medium text-slate-300 mb-2">Шаблоны не найдены</h3>
                <p className="text-slate-500 mb-4">Попробуйте изменить фильтры или создать новый шаблон</p>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                  Создать шаблон
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}
