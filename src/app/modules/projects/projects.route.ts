import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest.js';

import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';
import { projectController } from './projects.controller.js';
import { projectValidation } from './projects.validation.js';

const router = Router();

router.get('/', authMiddleware, projectController.getAllProjects);

router.post('/', authMiddleware, requireRole('ADMIN', 'MANAGER'), 
validateRequest(projectValidation.createProjectSchema), projectController.createProject);

router.get('/:id', authMiddleware, projectController.getProjectById);
router.patch('/:id', authMiddleware, requireRole('ADMIN', 'MANAGER'), validateRequest(projectValidation.updateProjectSchema), projectController.updateProject);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), projectController.deleteProject);
router.post('/:id/members', authMiddleware, requireRole('ADMIN', 'MANAGER'), validateRequest(projectValidation.addMemberSchema), projectController.addMember);
router.delete('/:id/members/:userId', authMiddleware, requireRole('ADMIN', 'MANAGER'), projectController.removeMember);

export const projectRoutes = router;