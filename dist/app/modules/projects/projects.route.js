"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectRoutes = void 0;
const express_1 = require("express");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const projects_controller_js_1 = require("./projects.controller.js");
const projects_validation_js_1 = require("./projects.validation.js");
const router = (0, express_1.Router)();
router.get('/', authMiddleware_js_1.default, projects_controller_js_1.projectController.getAllProjects);
router.post('/', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), (0, validateRequest_js_1.default)(projects_validation_js_1.projectValidation.createProjectSchema), projects_controller_js_1.projectController.createProject);
router.get('/:id', authMiddleware_js_1.default, projects_controller_js_1.projectController.getProjectById);
router.patch('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), (0, validateRequest_js_1.default)(projects_validation_js_1.projectValidation.updateProjectSchema), projects_controller_js_1.projectController.updateProject);
router.delete('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), projects_controller_js_1.projectController.deleteProject);
router.post('/:id/members', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), (0, validateRequest_js_1.default)(projects_validation_js_1.projectValidation.addMemberSchema), projects_controller_js_1.projectController.addMember);
router.delete('/:id/members/:userId', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), projects_controller_js_1.projectController.removeMember);
exports.projectRoutes = router;
//# sourceMappingURL=projects.route.js.map