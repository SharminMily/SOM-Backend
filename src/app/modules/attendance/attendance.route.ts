import { Router } from 'express';
import { attendanceController } from './attendance.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { attendanceValidation } from './attendance.validation.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';


const router = Router();

router.post('/clock-in', authMiddleware,requireRole("EMPLOYEE", "MANAGER"), validateRequest(attendanceValidation.clockInSchema), attendanceController.clockIn);
router.patch('/clock-out', authMiddleware, requireRole("EMPLOYEE", "MANAGER"),attendanceController.clockOut);
router.get('/me', authMiddleware, attendanceController.getMyAttendance);


router.get('/user/:id', authMiddleware, requireRole('ADMIN', 'MANAGER'), attendanceController.getUserAttendance);
router.get('/department/:id', authMiddleware, requireRole('ADMIN', 'MANAGER'), attendanceController.getDepartmentAttendance);
router.patch('/:id', authMiddleware, requireRole('ADMIN'), validateRequest(attendanceValidation.overrideSchema), attendanceController.overrideAttendance);

router.get(
  "/stats/:departmentId",
  authMiddleware,
  requireRole("ADMIN", "MANAGER"),
  attendanceController.getAttendanceStats
);

router.get(
  '/today',
  authMiddleware,
  requireRole('ADMIN', 'MANAGER'),
  attendanceController.getAllTodayAttendance
);
export const attendanceRoutes = router;