"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementRoutes = void 0;
const express_1 = require("express");
const announcement_controller_js_1 = require("./announcement.controller.js");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const announcement_validation_js_1 = require("./announcement.validation.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = (0, express_1.Router)();
router.get('/', authMiddleware_js_1.default, announcement_controller_js_1.announcementController.getAllAnnouncements);
router.post('/', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), (0, validateRequest_js_1.default)(announcement_validation_js_1.announcementValidation.createAnnouncementSchema), announcement_controller_js_1.announcementController.createAnnouncement);
router.get('/:id', authMiddleware_js_1.default, announcement_controller_js_1.announcementController.getAnnouncementById);
router.patch('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), (0, validateRequest_js_1.default)(announcement_validation_js_1.announcementValidation.updateAnnouncementSchema), announcement_controller_js_1.announcementController.updateAnnouncement);
router.delete('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), announcement_controller_js_1.announcementController.deleteAnnouncement);
exports.announcementRoutes = router;
//# sourceMappingURL=announcement.route.js.map