// src/routers/resume.router.js
import express from 'express';
import { prisma } from '../utils/prisma.util.js';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const router = express.Router();

router.post('/resume', requireAccessToken, async (req, res) => {
  const { title, introduction } = req.body;
  const userId = req.user.id;

  if (!title) {
    return res.status(400).json({ message: '제목을 입력해 주세요' });
  }

  if (!introduction) {
    return res.status(400).json({ message: '자기소개를 입력해 주세요' });
  }

  if (introduction.length < 150) {
    return res.status(400).json({ message: '자기소개는 150자 이상 작성해야 합니다.' });
  }

  try {
    const resume = await prisma.resume.create({
      data: {
        userId,
        title,
        introduction,
        status: 'APPLY',
      },
    });

    return res.status(201).json(resume);
  } catch (error) {
    return res.status(500).json({ message: '이력서 생성에 실패했습니다.' });
  }
});

export default router;




// src/routers/resume.router.js

router.get('/resume', requireAccessToken, async (req, res) => {
    const userId = req.user.id;
    const sort = req.query.sort && req.query.sort.toUpperCase() === 'ASC' ? 'asc' : 'desc';
  
    try {
      const resumes = await prisma.resume.findMany({
        where: { userId },
        orderBy: { createdAt: sort },
        include: { user: true },
      });
  
      const result = resumes.map(resume => ({
        id: resume.id,
        userName: resume.user.name,
        title: resume.title,
        introduction: resume.introduction,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      }));
  
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: '이력서 목록 조회에 실패했습니다.' });
    }
  });

  



  // src/routers/resume.router.js

router.get('/resume/:id', requireAccessToken, async (req, res) => {
    const userId = req.user.id;
    const resumeId = req.params.id;
  
    try {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId,
        },
        include: { user: true },
      });
  
      if (!resume) {
        return res.status(404).json({ message: '이력서가 존재하지 않습니다.' });
      }
  
      const result = {
        id: resume.id,
        userName: resume.user.name,
        title: resume.title,
        introduction: resume.introduction,
        status: resume.status,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
      };
  
      return res.json(result);
    } catch (error) {
      return res.status(500).json({ message: '이력서 조회에 실패했습니다.' });
    }
  });
  



  // src/routers/resume.router.js

router.patch('/resume/:id', requireAccessToken, async (req, res) => {
    const userId = req.user.id;
    const resumeId = req.params.id;
    const { title, introduction } = req.body;
  
    if (!title && !introduction) {
      return res.status(400).json({ message: '수정할 정보를 입력해 주세요.' });
    }
  
    try {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId,
        },
      });
  
      if (!resume) {
        return res.status(404).json({ message: '이력서가 존재하지 않습니다.' });
      }
  
      const updatedResume = await prisma.resume.update({
        where: { id: resumeId },
        data: {
          title: title || resume.title,
          introduction: introduction || resume.introduction,
        },
      });
  
      return res.json(updatedResume);
    } catch (error) {
      return res.status(500).json({ message: '이력서 수정에 실패했습니다.' });
    }
  });
  


  // src/routers/resume.router.js

router.delete('/resume/:id', requireAccessToken, async (req, res) => {
    const userId = req.user.id;
    const resumeId = req.params.id;
  
    try {
      const resume = await prisma.resume.findFirst({
        where: {
          id: resumeId,
          userId,
        },
      });
  
      if (!resume) {
        return res.status(404).json({ message: '이력서가 존재하지 않습니다.' });
      }
  
      await prisma.resume.delete({
        where: { id: resumeId },
      });
  
      return res.json({ id: resumeId });
    } catch (error) {
      return res.status(500).json({ message: '이력서 삭제에 실패했습니다.' });
    }
  });
  