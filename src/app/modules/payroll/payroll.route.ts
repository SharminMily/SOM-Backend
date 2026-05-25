import { Router } from 'express';
import { payrollController } from './payroll.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { payrollValidation } from './payroll.validation.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';

const router = Router();

router.post('/generate', authMiddleware, requireRole('ADMIN'), validateRequest(payrollValidation.generatePayrollSchema), payrollController.generatePayroll);
router.get('/', authMiddleware, requireRole('ADMIN'), payrollController.getAllPayrolls);
router.get('/me', authMiddleware, payrollController.getMyPayrolls);
router.get('/:id', authMiddleware, payrollController.getPayrollById);
router.patch('/:id/mark-paid', authMiddleware, requireRole('ADMIN'), payrollController.markAsPaid);

export const payrollRoutes = router;