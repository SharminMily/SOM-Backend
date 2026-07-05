"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const user_service_js_1 = require("./user.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const index_js_1 = __importDefault(require("../../config/index.js"));
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const createUserIntoDB = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.body || !req.body.email || !req.body.password) {
        throw new AppError_js_1.default(400, 'Email and password are required');
    }
    const result = await user_service_js_1.userService.createUserIntoDB(req.body);
    res.cookie('refreshToken', result.refreshToken, {
        secure: index_js_1.default.node_env === 'production',
        httpOnly: true,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 365,
    });
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User registered and logged in successfully',
        data: {
            user: result.user,
            accessToken: result.accessToken,
        },
    });
});
// getAllUsersFromDB
const getAllUsersFromDB = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await user_service_js_1.userService.getAllUsersFromDB();
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'users fetched successfully',
        data: result,
    });
});
// getSingleUserFromDB
const getSingleUserFromDB = (0, catchAsync_js_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_js_1.userService.getSingleUserFromDB(id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'users fetched successfully',
        data: result,
    });
});
// update user by id
// delete user
const deleteUserFromDB = (0, catchAsync_js_1.default)(async (req, res) => {
    const id = req.params.id;
    const result = await user_service_js_1.userService.deleteUserFromDB(id);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'user deleted successfully',
        data: result,
    });
});
const getMyProfile = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.user) {
        throw new AppError_js_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    const userId = req.user.id;
    const result = await user_service_js_1.userService.getMyProfileFromDB(userId);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile fetched successfully",
        data: result,
    });
});
const updateMyProfile = (0, catchAsync_js_1.default)(async (req, res) => {
    if (!req.user) {
        throw new AppError_js_1.default(http_status_1.default.UNAUTHORIZED, "Unauthorized");
    }
    const userId = req.user.id;
    const result = await user_service_js_1.userService.updateMyProfileIntoDB(userId, req.body);
    (0, sendResponse_js_1.default)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Profile updated successfully",
        data: result,
    });
});
exports.userController = {
    createUserIntoDB,
    getAllUsersFromDB,
    getSingleUserFromDB,
    deleteUserFromDB,
    getMyProfile,
    updateMyProfile,
};
//# sourceMappingURL=user.controller.js.map