import { Router } from 'express';
import { leaveController } from './leave.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { leaveValidation } from './leave.validation.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';

const router = Router();

router.post('/requests', authMiddleware, validateRequest(leaveValidation.applyLeaveSchema), leaveController.applyForLeave);
router.get('/requests', authMiddleware, requireRole('ADMIN', 'MANAGER'), leaveController.getAllLeaveRequests);


router.get(
  "/requests/me",
  authMiddleware,
  leaveController.getMyLeaveRequests
);


router.get('/requests/:id', authMiddleware, leaveController.getSingleLeaveRequest);

router.patch('/requests/:id/approve', authMiddleware, requireRole('ADMIN', 'MANAGER'), leaveController.approveLeave);
router.patch('/requests/:id/reject', authMiddleware, requireRole('ADMIN','MANAGER'), validateRequest(leaveValidation.rejectLeaveSchema), leaveController.rejectLeave);
router.delete('/requests/:id', authMiddleware, leaveController.cancelLeave);
router.get('/balances/me', authMiddleware, leaveController.getMyLeaveBalance);
router.get('/balances/:userId', authMiddleware, requireRole('ADMIN'), leaveController.getUserLeaveBalance);
router.patch('/balances/:userId', authMiddleware, requireRole('ADMIN'), validateRequest(leaveValidation.adjustBalanceSchema), leaveController.adjustLeaveBalance);

export const leaveRoutes = router;