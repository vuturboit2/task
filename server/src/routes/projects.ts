import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Получить все проекты
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { search, status, page = 1, limit = 10 } = req.query;
    
    const where: any = {};
    
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { description: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    
    if (status) where.status = status;

    const projects = await prisma.project.findMany({
      where,
      include: {
        tasks: {
          select: {
            id: true,
            title: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            tasks: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.project.count({ where });

    res.json({
      projects,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Ошибка получения проектов:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Получить проект по ID
router.get('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        tasks: {
          include: {
            creator: {
              select: { id: true, name: true, avatar: true }
            },
            assignee: {
              select: { id: true, name: true, avatar: true }
            },
            department: {
              select: { id: true, name: true }
            }
          },
          orderBy: { createdAt: 'desc' }
        },
        _count: {
          select: {
            tasks: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({ message: 'Проект не найден' });
    }

    res.json({ project });
  } catch (error) {
    console.error('Ошибка получения проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Создать проект
router.post('/', [
  body('name').trim().isLength({ min: 2 }),
  body('description').optional(),
  body('status').optional().isIn(['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, description, status = 'ACTIVE' } = req.body;

    const project = await prisma.project.create({
      data: {
        name,
        description,
        status
      }
    });

    res.status(201).json({ project });
  } catch (error) {
    console.error('Ошибка создания проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Обновить проект
router.put('/:id', [
  body('name').optional().trim().isLength({ min: 2 }),
  body('description').optional(),
  body('status').optional().isIn(['ACTIVE', 'COMPLETED', 'ON_HOLD', 'CANCELLED'])
], async (req: AuthRequest, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const updateData = req.body;

    const project = await prisma.project.update({
      where: { id },
      data: updateData
    });

    res.json({ project });
  } catch (error) {
    console.error('Ошибка обновления проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить проект
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id }
    });

    res.json({ message: 'Проект удален' });
  } catch (error) {
    console.error('Ошибка удаления проекта:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
