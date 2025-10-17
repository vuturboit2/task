import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Получить всех пользователей
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { search, role, department, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (role) where.role = role;
    if (department) {
      where.departmentUsers = {
        some: {
          departmentId: department
        }
      };
    }

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        departmentUsers: {
          include: {
            department: {
              select: { id: true, name: true }
            }
          }
        }
      },
      orderBy: { name: 'asc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.user.count({ where });

    res.json({
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Ошибка получения пользователей:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить пользователя по ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        createdAt: true,
        departmentUsers: {
          include: {
            department: {
              select: { id: true, name: true }
            }
          }
        },
        createdTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        assignedTasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (!user) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Ошибка получения пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить профиль пользователя
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('avatar').optional().isURL()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { name, avatar } = req.body;

    // Проверяем права доступа
    if (req.user!.id !== id && req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const user = await prisma.user.update({
      where: { id },
      data: { name, avatar },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        updatedAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Ошибка обновления пользователя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Изменить роль пользователя (только для админов)
router.put('/:id/role', [
  body('role').isIn(['ADMIN', 'MANAGER', 'USER'])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (req.user!.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Недостаточно прав' });
    }

    const { id } = req.params;
    const { role } = req.body;

    const user = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updatedAt: true
      }
    });

    res.json({ user });
  } catch (error) {
    console.error('Ошибка изменения роли:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить статистику пользователя
router.get('/:id/stats', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const stats = await prisma.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            createdTasks: true,
            assignedTasks: true,
            watchingTasks: true,
            comments: true
        }
      }
    });

    if (!stats) {
      return res.status(404).json({ message: 'Пользователь не найден' });
    }

    // Статистика по статусам задач
    const taskStats = await prisma.task.groupBy({
      by: ['status'],
      where: {
        OR: [
          { creatorId: id },
          { assigneeId: id }
        ]
      },
      _count: {
        status: true
      }
    });

    res.json({
      stats: stats._count,
      taskStats
    });
  } catch (error) {
    console.error('Ошибка получения статистики:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
