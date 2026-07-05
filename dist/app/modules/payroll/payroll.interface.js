"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.payrollSelectFields = void 0;
exports.payrollSelectFields = {
    id: true,
    month: true,
    year: true,
    baseSalary: true,
    allowances: true,
    deductions: true,
    netSalary: true,
    status: true,
    paidAt: true,
    createdAt: true,
    userId: true,
    user: { select: { id: true, firstName: true, lastName: true, email: true, departmentId: true } },
};
//# sourceMappingURL=payroll.interface.js.map