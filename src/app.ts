import express from 'express';
import type { Application, Request, Response } from 'express';
import status from 'http-status';
import router from './app/routes/index.js';
import notFound from './app/middlewares/notFound.js';
import globalErrorHandler from './app/middlewares/globalErrorhandler.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app: Application = express();
app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
);;
app.use(express.json());                    
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/', (req: Request, res: Response) => {
  res.status(status.OK).json({
    success: true,
    message: 'Server Is Running',
  });
});

app.use('/api', router);
app.use(notFound);
app.use(globalErrorHandler);

export default app;