import { Router } from "express";
import { userRouter } from "../modules/user/user.routes.js";

const router = Router();

const moduleRoutes = [
  {
    path: '/user',
    route: userRouter,
  },
  
  {
     path: '/auth',
     route: userRouter,
  },
];

moduleRoutes.forEach((item) => router.use(item.path, item.route));

export default router;
