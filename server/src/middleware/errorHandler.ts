import { Request, Response, NextFunction } from 'express';

export const errorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Ошибка:', error);

  // Prisma ошибки
  if (error.code === 'P2002') {
    return res.status(400).json({
      message: 'Нарушение уникальности',
      field: error.meta?.target
    });
  }

  if (error.code === 'P2025') {
    return res.status(404).json({
      message: 'Запись не найдена'
    });
  }

  // JWT ошибки
  if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      message: 'Недействительный токен'
    });
  }

  if (error.name === 'TokenExpiredError') {
    return res.status(401).json({
      message: 'Токен истек'
    });
  }

  // Валидация
  if (error.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Ошибка валидации',
      errors: error.details
    });
  }

  // По умолчанию
  res.status(error.status || 500).json({
    message: error.message || 'Внутренняя ошибка сервера',
    ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
  });
};
