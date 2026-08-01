import express, { type NextFunction, type Request, type Response } from 'express';
import { userController } from './user.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';


const router = express.Router();


router.get("/me", authMiddleware, requireRole('ADMIN', 'MANAGER', 'EMPLOYEE'),  userController.getMyProfile);

router.patch(
  "/me",
  authMiddleware ,
  userController.updateMyProfile
);

router.get('/', authMiddleware, requireRole('ADMIN'),  userController.getAllUsersFromDB);
router.get('/:id', authMiddleware, requireRole('ADMIN', 'MANAGER', 'EMPLOYEE'), userController.getSingleUserFromDB);

router.delete('/:id', authMiddleware, requireRole('ADMIN'), userController.deleteUserFromDB);
router.patch('/:id', authMiddleware, requireRole('ADMIN'), userController.updateUserFromDB);

router.post('/', userController.createUserIntoDB);




export const userRoute = router;
