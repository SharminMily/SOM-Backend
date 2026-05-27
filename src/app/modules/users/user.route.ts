import express, { type NextFunction, type Request, type Response } from 'express';
import { userController } from './user.controller.js';


const router = express.Router();


router.get('/', userController.getAllUsersFromDB);
router.get('/:id', userController.getSingleUserFromDB);
router.delete('/', userController.deleteUserFromDB);
router.post('/', userController.createUserIntoDB);


export const userRoute = router;
