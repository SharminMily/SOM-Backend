"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentController = void 0;
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const department_service_js_1 = require("./department.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const http_status_1 = __importDefault(require("http-status"));
// create department
const createDepartmentIntoDB = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.body || !req.body.name) {
        throw new AppError_js_1.default(400, 'Department name is required');
    }
    const result = await department_service_js_1.departmentService.createDepartmentIntoDB(req.body);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Department created successfully',
        data: result,
    });
});
// get all departments
const getAllDepartmentsFromDB = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await department_service_js_1.departmentService.getAllDepartmentsFromDB();
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Departments fetched successfully',
        data: result,
    });
});
// get single department
const getSingleDepartmentFromDB = (0, catchAsync_js_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await department_service_js_1.departmentService.getSingleDepartmentFromDB(id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Department fetched successfully',
        data: result,
    });
});
// update department
const updateDepartmentIntoDB = (0, catchAsync_js_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await department_service_js_1.departmentService.updateDepartmentIntoDB(id, req.body);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Department updated successfully',
        data: result,
    });
});
// delete department
const deleteDepartmentFromDB = (0, catchAsync_js_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await department_service_js_1.departmentService.deleteDepartmentFromDB(id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Department deleted successfully',
        data: result,
    });
});
exports.departmentController = {
    createDepartmentIntoDB,
    getAllDepartmentsFromDB,
    getSingleDepartmentFromDB,
    updateDepartmentIntoDB,
    deleteDepartmentFromDB,
};
//# sourceMappingURL=department.controller.js.map