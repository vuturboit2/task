import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Получить все задачи
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { status, priority, assignee, department, project, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (assignee) where.assigneeId = assignee;
    if (department) where.departmentId = department;
    if (project) where.projectId = project;

    const tasks = await prisma.task.findMany({
      where,
      include: {
        creator: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        watchers: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        department: {
          select: { id: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        attachments: true,
        _count: {
          select: {
            comments: true,
            attachments: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.task.count({ where });

    res.json({
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Ошибка получения задач:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить задачу по ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: {
        creator: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        watchers: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        department: {
          select: { id: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        },
        comments: {
          include: {
            user: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'asc' }
        },
        attachments: true
      }
    });

    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    res.json({ task });
  } catch (error) {
    console.error('Ошибка получения задачи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать задачу
router.post('/', [
  body('title').trim().isLength({ min: 1 }),
  body('description').optional(),
  body('priority').isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('dueDate').optional().isISO8601(),
  body('assigneeId').optional().isUUID(),
  body('departmentId').optional().isUUID(),
  body('projectId').optional().isUUID(),
  body('watcherIds').optional().isArray()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      description,
      priority,
      dueDate,
      assigneeId,
      departmentId,
      projectId,
      watcherIds = []
    } = req.body;

    const task = await prisma.task.create({
      data: {
        title,
        description,
        priority,
        dueDate: dueDate ? new Date(dueDate) : null,
        creatorId: req.user!.id,
        assigneeId,
        departmentId,
        projectId,
        watchers: {
          connect: watcherIds.map((id: string) => ({ id }))
        }
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        watchers: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        department: {
          select: { id: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });

    // Уведомляем через Socket.io
    if (req.io) {
      req.io.emit('task-created', task);
      
      // Уведомляем назначенного пользователя
      if (assigneeId) {
        req.io.to(assigneeId).emit('task-assigned', task);
      }
      
      // Уведомляем наблюдателей
      watcherIds.forEach((watcherId: string) => {
        req.io.to(watcherId).emit('task-watched', task);
      });
    }

    res.status(201).json({ task });
  } catch (error) {
    console.error('Ошибка создания задачи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить задачу
router.put('/:id', [
  body('title').optional().trim().isLength({ min: 1 }),
  body('description').optional(),
  body('status').optional().isIn(['TODO', 'IN_PROGRESS', 'IN_REVIEW', 'DONE', 'CANCELLED']),
  body('priority').optional().isIn(['LOW', 'MEDIUM', 'HIGH', 'URGENT']),
  body('dueDate').optional().isISO8601(),
  body('assigneeId').optional().isUUID(),
  body('departmentId').optional().isUUID(),
  body('projectId').optional().isUUID()
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    // Проверяем, существует ли задача
    const existingTask = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true, watchers: true }
    });

    if (!existingTask) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    const task = await prisma.task.update({
      where: { id },
      data: {
        ...updateData,
        dueDate: updateData.dueDate ? new Date(updateData.dueDate) : undefined
      },
      include: {
        creator: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        assignee: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        watchers: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        department: {
          select: { id: true, name: true }
        },
        project: {
          select: { id: true, name: true }
        }
      }
    });

    // Уведомляем через Socket.io
    if (req.io) {
      req.io.emit('task-updated', task);
      
      // Уведомляем о смене статуса
      if (updateData.status && updateData.status !== existingTask.status) {
        req.io.to(existingTask.assigneeId || '').emit('task-status-changed', task);
      }
    }

    res.json({ task });
  } catch (error) {
    console.error('Ошибка обновления задачи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить наблюдателя
router.post('/:id/watchers', [
  body('userId').isUUID()
], async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    const task = await prisma.task.update({
      where: { id },
      data: {
        watchers: {
          connect: { id: userId }
        }
      },
      include: {
        watchers: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    // Уведомляем через Socket.io
    if (req.io) {
      req.io.to(userId).emit('task-watched', task);
    }

    res.json({ task });
  } catch (error) {
    console.error('Ошибка добавления наблюдателя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить наблюдателя
router.delete('/:id/watchers/:userId', async (req: AuthRequest, res) => {
  try {
    const { id, userId } = req.params;

    const task = await prisma.task.update({
      where: { id },
      data: {
        watchers: {
          disconnect: { id: userId }
        }
      },
      include: {
        watchers: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    res.json({ task });
  } catch (error) {
    console.error('Ошибка удаления наблюдателя:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить задачу
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id },
      include: { assignee: true, watchers: true }
    });

    if (!task) {
      return res.status(404).json({ message: 'Задача не найдена' });
    }

    await prisma.task.delete({
      where: { id }
    });

    // Уведомляем через Socket.io
    if (req.io) {
      req.io.emit('task-deleted', { id });
    }

    res.json({ message: 'Задача удалена' });
  } catch (error) {
    console.error('Ошибка удаления задачи:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
