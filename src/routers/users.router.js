// src/routers/users.router.js
import express from 'express';
import { requireAccessToken } from '../middlewares/require-access-token.middleware.js';

const router = express.Router();

router.get('/me', requireAccessToken, (req, res) => {
  const user = req.user;
  res.json({
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  });
});

export default router;
