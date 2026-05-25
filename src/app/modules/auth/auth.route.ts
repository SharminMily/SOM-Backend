import { Router } from 'express';
import { authController } from './auth.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { authValidation } from './auth.validation.js';

const router = Router();

// public routes
router.post('/login', authController.loginUser);

router.post('/refresh', authController.refreshToken);

router.post('/logout', authController.logoutUser);

router.get('/verify-email', authController.verifyEmail);

router.post(
  '/forgot-password',
  validateRequest(authValidation.forgotPasswordSchema),
  authController.forgotPassword,
);

router.post(
  '/reset-password',
  validateRequest(authValidation.resetPasswordSchema),
  authController.resetPassword,
);

export const authRoute = router;