import express from 'express';
import { body, validationResult } from 'express-validator';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();

// Получить уведомления пользователя
router.get('/', async (req: AuthRequest, res) => {
  try {
    const { page = 1, limit = 10, unread } = req.query;
    
    const where: any = {
      userId: req.user!.id
    };
    
    if (unread === 'true') {
      where.read = false;
    }

    const notifications = await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (Number(page) - 1) * Number(limit),
      take: Number(limit)
    });

    const total = await prisma.notification.count({ where });
    const unreadCount = await prisma.notification.count({
      where: { userId: req.user!.id, read: false }
    });

    res.json({
      notifications,
      unreadCount,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Ошибка получения уведомлений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отметить уведомление как прочитанное
router.put('/:id/read', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { 
        id,
        userId: req.user!.id
      },
      data: { read: true }
    });

    res.json({ notification });
  } catch (error) {
    console.error('Ошибка обновления уведомления:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Отметить все уведомления как прочитанные
router.put('/read-all', async (req: AuthRequest, res) => {
  try {
    await prisma.notification.updateMany({
      where: { 
        userId: req.user!.id,
        read: false
      },
      data: { read: true }
    });

    res.json({ message: 'Все уведомления отмечены как прочитанные' });
  } catch (error) {
    console.error('Ошибка обновления уведомлений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить уведомление
router.delete('/:id', async (req: AuthRequest, res) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { 
        id,
        userId: req.user!.id
      }
    });

    res.json({ message: 'Уведомление удалено' });
  } catch (error) {
    console.error('Ошибка удаления уведомления:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

// Удалить все уведомления
router.delete('/all', async (req: AuthRequest, res) => {
  try {
    await prisma.notification.deleteMany({
      where: { userId: req.user!.id }
    });

    res.json({ message: 'Все уведомления удалены' });
  } catch (error) {
    console.error('Ошибка удаления уведомлений:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
});

export default router;
