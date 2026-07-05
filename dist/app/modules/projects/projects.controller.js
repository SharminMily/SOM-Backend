"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.projectController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const projects_service_js_1 = require("./projects.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const createProject = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await projects_service_js_1.projectService.createProject(req.user?.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Project created successfully', data: result });
});
const getAllProjects = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await projects_service_js_1.projectService.getAllProjects(req.user?.id, req.user?.role);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Projects fetched successfully', data: result });
});
const getProjectById = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await projects_service_js_1.projectService.getProjectById(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Project fetched successfully', data: result });
});
const updateProject = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await projects_service_js_1.projectService.updateProject(req.params.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Project updated successfully', data: result });
});
const deleteProject = (0, catchAsync_js_1.default)(async (req, res) => {
    await projects_service_js_1.projectService.deleteProject(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Project deleted successfully', data: null });
});
const addMember = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await projects_service_js_1.projectService.addMember(req.params.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Member added successfully', data: result });
});
const removeMember = (0, catchAsync_js_1.default)(async (req, res) => {
    await projects_service_js_1.projectService.removeMember(req.params.id, req.params.userId);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Member removed successfully', data: null });
});
exports.projectController = { createProject, getAllProjects, getProjectById, updateProject, deleteProject, addMember, removeMember };
//# sourceMappingURL=projects.controller.js.map