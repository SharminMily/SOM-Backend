import { Router } from 'express';

import { departmentValidation } from './department.validation.js';
import { departmentController } from './department.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';

const router = Router();

router.post(
  '/',
  validateRequest(departmentValidation.createDepartmentSchema),
  departmentController.createDepartmentIntoDB,                
);

router.get('/', departmentController.getAllDepartmentsFromDB);

router.get('/:id', departmentController.getSingleDepartmentFromDB);

router.patch(
  '/:id',
  validateRequest(departmentValidation.updateDepartmentSchema),
  departmentController.updateDepartmentIntoDB,
);

router.delete('/:id', departmentController.deleteDepartmentFromDB);

export const departmentRoute = router;