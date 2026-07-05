"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRoute = void 0;
const express_1 = require("express");
const auth_controller_js_1 = require("./auth.controller.js");
const validateRequest_js_1 = __importDefault(require("../../middlewares/validateRequest.js"));
const auth_validation_js_1 = require("./auth.validation.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = (0, express_1.Router)();
// public routes
router.post('/login', auth_controller_js_1.authController.loginUser);
router.post('/refresh', auth_controller_js_1.authController.refreshToken);
router.post('/logout', auth_controller_js_1.authController.logoutUser);
router.get('/verify-email', auth_controller_js_1.authController.verifyEmail);
router.post('/forgot-password', (0, validateRequest_js_1.default)(auth_validation_js_1.authValidation.forgotPasswordSchema), auth_controller_js_1.authController.forgotPassword);
router.post('/reset-password', (0, validateRequest_js_1.default)(auth_validation_js_1.authValidation.resetPasswordSchema), auth_controller_js_1.authController.resetPassword);
router.get('/me', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER', "EMPLOYEE"), auth_controller_js_1.authController.getCurrentUser);
//authMiddleware, requireRole('ADMIN','MANAGER', "EMPLOYEE"),
exports.authRoute = router;
//# sourceMappingURL=auth.route.js.map