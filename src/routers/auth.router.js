import express from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../utils/prisma.util.js';

const router = express.Router();

router.post('/signup', async (req, res) => {
  const { email, password, passwordConfirm, name } = req.body;

  if (!email || !password || !passwordConfirm || !name) {
    return res.status(400).json({ message: '모든 필드를 입력해 주세요.' });
  }

  if (password !== passwordConfirm) {
    return res.status(400).json({ message: '비밀번호가 일치하지 않습니다.' });
  }

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return res.status(400).json({ message: '이미 가입된 사용자입니다.' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      role: 'APPLICANT',
    },
  });

  return res.status(201).json({
    id: newUser.id,
    email: newUser.email,
    name: newUser.name,
    role: newUser.role,
    createdAt: newUser.createdAt,
    updatedAt: newUser.updatedAt,
  });
});

export default router;

