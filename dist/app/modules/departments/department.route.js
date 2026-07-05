"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentRoute = void 0;
const express_1 = require("express");
const department_validation_js_1 = require("./department.validation.js");
const department_controller_js_1 = require("./department.controller.js");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const router = (0, express_1.Router)();
router.post('/', (0, validateRequest_js_1.default)(department_validation_js_1.departmentValidation.createDepartmentSchema), department_controller_js_1.departmentController.createDepartmentIntoDB);
router.get('/', department_controller_js_1.departmentController.getAllDepartmentsFromDB);
router.get('/:id', department_controller_js_1.departmentController.getSingleDepartmentFromDB);
router.patch('/:id', (0, validateRequest_js_1.default)(department_validation_js_1.departmentValidation.updateDepartmentSchema), department_controller_js_1.departmentController.updateDepartmentIntoDB);
router.delete('/:id', department_controller_js_1.departmentController.deleteDepartmentFromDB);
exports.departmentRoute = router;
//# sourceMappingURL=department.route.js.map