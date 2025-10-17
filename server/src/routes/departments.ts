import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, requireRole } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Получить все отделы
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { search, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }

    const departments = await prisma.department.findMany({
      where,
      include: {
        head: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        users: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        },
        _count: {
          select: {
            users: true,
            tasks: true
          }
        }
      },
      orderBy: { name: 'asc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.department.count({ where });

    res.json({
      departments,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Ошибка получения отделов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить отдел по ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const department = await prisma.department.findUnique({
      where: { id },
      include: {
        head: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        users: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true, role: true }
            }
          }
        },
        tasks: {
          include: {
            creator: {
              select: { id: true, name: true, avatar: true }
            },
            assignee: {
              select: { id: true, name: true, avatar: true }
            }
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        _count: {
          select: {
            users: true,
            tasks: true
          }
        }
      }
    });

    if (!department) {
      return res.status(404).json({ message: 'Отдел не найден' });
    }

    res.json({ department });
  } catch (error) {
    console.error('Ошибка получения отдела:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать отдел
router.post('/', [
  body('name').trim().isLength({ min: 2 }),
  body('description').optional(),
  body('headId').isUUID()
], requireRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, headId } = req.body;

    const department = await prisma.department.create({
      data: {
        name,
        description,
        headId
      },
      include: {
        head: {
          select: { id: true, name: true, email: true, avatar: true }
        }
      }
    });

    res.status(201).json({ department });
  } catch (error) {
    console.error('Ошибка создания отдела:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить отдел
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional(),
  body('headId').optional().isUUID()
], requireRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const department = await prisma.department.update({
      where: { id },
      data: updateData,
      include: {
        head: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        users: {
          include: {
            user: {
              select: { id: true, name: true, email: true, avatar: true }
            }
          }
        }
      }
    });

    res.json({ department });
  } catch (error) {
    console.error('Ошибка обновления отдела:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Добавить пользователя в отдел
router.post('/:id/users', [
  body('userId').isUUID(),
  body('role').optional().isIn(['MEMBER', 'MANAGER'])
], requireRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const { userId, role = 'MEMBER' } = req.body;

    const departmentUser = await prisma.departmentUser.create({
      data: {
        userId,
        departmentId: id,
        role
      },
      include: {
        user: {
          select: { id: true, name: true, email: true, avatar: true }
        },
        department: {
          select: { id: true, name: true }
        }
      }
    });

    res.status(201).json({ departmentUser });
  } catch (error) {
    console.error('Ошибка добавления пользователя в отдел:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить пользователя из отдела
router.delete('/:id/users/:userId', requireRole(['ADMIN', 'MANAGER']), async (req: AuthRequest, res) => {
  try {
    const { id, userId } = req.params;

    await prisma.departmentUser.delete({
      where: {
        userId_departmentId: {
          userId,
          departmentId: id
        }
      }
    });

    res.json({ message: 'Пользователь удален из отдела' });
  } catch (error) {
    console.error('Ошибка удаления пользователя из отдела:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить отдел
router.delete('/:id', requireRole(['ADMIN']), async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.department.delete({
      where: { id }
    });

    res.json({ message: 'Отдел удален' });
  } catch (error) {
    console.error('Ошибка удаления отдела:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
