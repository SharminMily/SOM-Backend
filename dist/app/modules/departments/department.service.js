"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.departmentService = void 0;
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const prisma_js_1 = require("../../shared/prisma.js");
const department_interface_js_1 = require("./department.interface.js");
// create department
const createDepartmentIntoDB = async (data) => {
    const existing = await prisma_js_1.prisma.department.findUnique({
        where: { name: data.name },
    });
    if (existing) {
        throw new AppError_js_1.default(409, 'Department name already exists');
    }
    const result = await prisma_js_1.prisma.department.create({
        data,
        select: department_interface_js_1.publicDepartmentSelectFields,
    });
    return result;
};
// get all departments
const getAllDepartmentsFromDB = async () => {
    const result = await prisma_js_1.prisma.department.findMany({
        select: department_interface_js_1.publicDepartmentSelectFields,
    });
    return result;
};
// get single department
const getSingleDepartmentFromDB = async (id) => {
    const result = await prisma_js_1.prisma.department.findUniqueOrThrow({
        where: { id },
        select: department_interface_js_1.publicDepartmentSelectFields,
    });
    return result;
};
// update department
const updateDepartmentIntoDB = async (id, data) => {
    await prisma_js_1.prisma.department.findUniqueOrThrow({
        where: { id },
    });
    const result = await prisma_js_1.prisma.department.update({
        where: { id },
        data,
        select: department_interface_js_1.publicDepartmentSelectFields,
    });
    return result;
};
// delete department
const deleteDepartmentFromDB = async (id) => {
    await prisma_js_1.prisma.department.findUniqueOrThrow({
        where: { id },
    });
    const result = await prisma_js_1.prisma.department.delete({
        where: { id },
    });
    return result;
};
exports.departmentService = {
    createDepartmentIntoDB,
    getAllDepartmentsFromDB,
    getSingleDepartmentFromDB,
    updateDepartmentIntoDB,
    deleteDepartmentFromDB,
};
//# sourceMappingURL=department.service.js.map