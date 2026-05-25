import { Router } from 'express';
import { announcementController } from './announcement.controller.js';
import validateRequest from '../../middlewares/validateRequest.js';
import { announcementValidation } from './announcement.validation.js';
import authMiddleware from '../../middlewares/authMiddleware.js';
import requireRole from '../../middlewares/requireRole.js';

const router = Router();

router.get('/', authMiddleware, announcementController.getAllAnnouncements);
router.post('/', authMiddleware, requireRole('ADMIN', 'MANAGER'), validateRequest(announcementValidation.createAnnouncementSchema), announcementController.createAnnouncement);
router.get('/:id', authMiddleware, announcementController.getAnnouncementById);
router.patch('/:id', authMiddleware, requireRole('ADMIN', 'MANAGER'), validateRequest(announcementValidation.updateAnnouncementSchema), announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware, requireRole('ADMIN'), announcementController.deleteAnnouncement);

export const announcementRoutes = router;