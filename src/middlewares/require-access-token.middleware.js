// src/middlewares/require-access-token.middleware.js
import jwt from 'jsonwebtoken';
import { prisma } from '../utils/prisma.util.js';

export const requireAccessToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: '인증 정보가 없습니다.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: '인증 정보가 유효하지 않습니다.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });

    if (!user) {
      return res.status(401).json({ message: '인증 정보와 일치하는 사용자가 없습니다.' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ message: '인증 정보가 유효하지 않습니다.' });
  }
};
