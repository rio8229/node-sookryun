import express from 'express';
import { server_port }  from './constants/env.constant.js';
import dotenv from 'dotenv';
import { errorHandler } from './middlewares/error-handler.middleware.js';
import authRouter from './routers/auth.router.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get(path:'/health-check',(req,res): any =>{
  throw new Error(message: `예상치 못한 에러`);
  return res.status(code:200).send(body:`살아있네`);
});

app.use('/auth', authRouter);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(server_port, () : void => {
  console.log(message `서버가 ${server_port}에서 실행중입니다`);
});
