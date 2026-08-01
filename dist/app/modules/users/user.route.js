"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoute = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_js_1 = require("./user.controller.js");
const authMiddleware_js_1 = __importDefault(require("../../middlewares/authMiddleware.js"));
const requireRole_js_1 = __importDefault(require("../../middlewares/requireRole.js"));
const router = express_1.default.Router();
router.get("/me", authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER', 'EMPLOYEE'), user_controller_js_1.userController.getMyProfile);
router.patch("/me", authMiddleware_js_1.default, user_controller_js_1.userController.updateMyProfile);
router.get('/', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), user_controller_js_1.userController.getAllUsersFromDB);
router.get('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN', 'MANAGER', 'EMPLOYEE'), user_controller_js_1.userController.getSingleUserFromDB);
router.delete('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), user_controller_js_1.userController.deleteUserFromDB);
router.patch('/:id', authMiddleware_js_1.default, (0, requireRole_js_1.default)('ADMIN'), user_controller_js_1.userController.updateUserFromDB);
router.post('/', user_controller_js_1.userController.createUserIntoDB);
exports.userRoute = router;
//# sourceMappingURL=user.route.js.map