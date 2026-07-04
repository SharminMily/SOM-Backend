import { Router } from 'express';
import { dashboardController } from './dashboard.controller.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';



const router = Router();


router.get(
  "/admin",
  authMiddleware,
  requireRole("ADMIN"),
  dashboardController.getAdminDashboard
);


router.get(
  "/manager",
  authMiddleware,
  requireRole("MANAGER"),
  dashboardController.getManagerDashboard
);


router.get('/employee', authMiddleware, requireRole('ADMIN', 'MANAGER', 'EMPLOYEE'),  dashboardController.getEmployeeDashboard);





export const dashboardRoute = router;