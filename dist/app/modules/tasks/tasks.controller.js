"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const tasks_service_js_1 = require("./tasks.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const getProjectTasks = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await tasks_service_js_1.taskService.getProjectTasks(req.params.projectId);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Tasks fetched successfully', data: result });
});
const createTask = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await tasks_service_js_1.taskService.createTask(req.params.projectId, req.user?.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Task created successfully', data: result });
});
const getTaskById = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await tasks_service_js_1.taskService.getTaskById(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Task fetched successfully', data: result });
});
const updateTask = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await tasks_service_js_1.taskService.updateTask(req.params.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Task updated successfully', data: result });
});
const deleteTask = (0, catchAsync_js_1.default)(async (req, res) => {
    await tasks_service_js_1.taskService.deleteTask(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Task deleted successfully', data: null });
});
const getTaskComments = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await tasks_service_js_1.taskService.getTaskComments(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Comments fetched successfully', data: result });
});
const addComment = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await tasks_service_js_1.taskService.addComment(req.params.id, req.user?.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Comment added successfully', data: result });
});
const deleteComment = (0, catchAsync_js_1.default)(async (req, res) => {
    await tasks_service_js_1.taskService.deleteComment(req.params.cid, req.user?.id, req.user?.role);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Comment deleted successfully', data: null });
});
const getMyTasks = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.user?.id) {
        throw new Error('Unauthorized');
    }
    const result = await tasks_service_js_1.taskService.getMyTasks(req.user.id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: 200,
        success: true,
        message: 'My tasks fetched successfully',
        data: result,
    });
});
exports.taskController = { getProjectTasks, createTask, getTaskById, updateTask, deleteTask, getTaskComments, addComment, deleteComment,
    getMyTasks
};
//# sourceMappingURL=tasks.controller.js.map