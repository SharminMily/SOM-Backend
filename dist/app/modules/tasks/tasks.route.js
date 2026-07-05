"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskRoutes = void 0;
const express_1 = require("express");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const tasks_controller_js_1 = require("./tasks.controller.js");
const tasks_validation_js_1 = require("./tasks.validation.js");
const router = (0, express_1.Router)();
router.get('/project/:projectId', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), authMiddleware_js_1.default, tasks_controller_js_1.taskController.getProjectTasks);
router.post('/project/:projectId', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), (0, validateRequest_js_1.default)(tasks_validation_js_1.taskValidation.createTaskSchema), tasks_controller_js_1.taskController.createTask);
router.get('/my', authMiddleware_js_1.default, (0, requireRole_js_1.default)('EMPLOYEE'), tasks_controller_js_1.taskController.getMyTasks);
router.get('/:id', authMiddleware_js_1.default, tasks_controller_js_1.taskController.getTaskById);
router.patch('/:id', authMiddleware_js_1.default, (0, validateRequest_js_1.default)(tasks_validation_js_1.taskValidation.updateTaskSchema), tasks_controller_js_1.taskController.updateTask);
router.delete('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER'), tasks_controller_js_1.taskController.deleteTask);
router.get('/:id/comments', authMiddleware_js_1.default, tasks_controller_js_1.taskController.getTaskComments);
router.post('/:id/comments', authMiddleware_js_1.default, (0, validateRequest_js_1.default)(tasks_validation_js_1.taskValidation.addCommentSchema), tasks_controller_js_1.taskController.addComment);
router.delete('/:id/comments/:cid', authMiddleware_js_1.default, tasks_controller_js_1.taskController.deleteComment);
exports.taskRoutes = router;
//# sourceMappingURL=tasks.route.js.map