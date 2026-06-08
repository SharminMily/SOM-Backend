import { Router } from 'express';

import validateRequest from '../../middlewares/validateRequest.js';

import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';
import { taskController } from './tasks.controller.js';
import { taskValidation } from './tasks.validation.js';

const router = Router();

router.get('/project/:projectId', authMiddleware, taskController.getProjectTasks);

router.post('/project/:projectId', authMiddleware, requireRole('ADMIN', 'MANAGER'), validateRequest(taskValidation.createTaskSchema), taskController.createTask);

router.get('/:id', authMiddleware, taskController.getTaskById);

router.patch('/:id', authMiddleware, validateRequest(taskValidation.updateTaskSchema), taskController.updateTask);
router.delete('/:id', authMiddleware, requireRole('ADMIN', 'MANAGER'), taskController.deleteTask);

router.get('/:id/comments', authMiddleware, taskController.getTaskComments);
router.post('/:id/comments', authMiddleware, validateRequest(taskValidation.addCommentSchema), taskController.addComment);
router.delete('/:id/comments/:cid', authMiddleware, taskController.deleteComment);

export const taskRoutes = router;