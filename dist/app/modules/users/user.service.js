"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_js_1 = require("../../shared/prisma.js");
const user_interface_js_1 = require("./user.interface.js");
const AppError_js_1 = __importDefault(require("../../errors/AppError.js"));
const jwtHelpers_js_1 = require("../../helpers/jwtHelpers.js");
const client_1 = require("@prisma/client");
const index_js_1 = __importDefault(require("../../config/index.js"));
// createUserIntoDB
const createUserIntoDB = async (userData) => {
    const { password, ...restData } = userData;
    try {
        const existingUser = await prisma_js_1.prisma.user.findUnique({
            where: { email: restData.email },
        });
        if (existingUser) {
            throw new AppError_js_1.default(409, 'Email already exists');
        }
        const hashPassword = await bcrypt_1.default.hash(password, 12);
        const newUserData = {
            ...restData,
            password: hashPassword,
        };
        // Create new user
        const newUser = await prisma_js_1.prisma.user.create({
            data: newUserData,
        });
        // token payload
        const tokenPayload = {
            id: newUser.id,
            email: newUser.email,
            name: `${newUser.firstName} ${newUser.lastName}`,
            phoneNumber: newUser.phone,
            profileImage: newUser.avatarUrl ?? undefined,
            role: newUser.role,
            status: newUser.status,
            departmentId: newUser.departmentId ?? undefined,
            managerId: newUser.managerId ?? undefined,
            joinedDate: newUser.joinedDate ?? undefined,
        };
        const accessToken = jwtHelpers_js_1.jwtHelpers.createToken(tokenPayload, index_js_1.default.jwt.ACCESS_TOKEN_SECRET, index_js_1.default.jwt.ACCESS_TOKEN_EXPIRES_IN);
        const refreshToken = jwtHelpers_js_1.jwtHelpers.createToken(tokenPayload, index_js_1.default.jwt.REFRESH_TOKEN_SECRET, index_js_1.default.jwt.REFRESH_TOKEN_EXPIRES_IN);
        return {
            user: newUser,
            accessToken,
            refreshToken,
        };
    }
    catch (error) {
        if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
            if (error.code === 'P2002') {
                const field = error.meta?.target?.[0];
                if (field === 'email') {
                    throw new AppError_js_1.default(409, 'Email already exists');
                }
                else if (field === 'phoneNumber') {
                    // console.error('Phone number conflict detected');
                    throw new AppError_js_1.default(409, 'Phone number already exists');
                }
            }
        }
        throw new AppError_js_1.default(500, 'Failed to create or login user');
    }
};
// get User
const getAllUsersFromDB = async () => {
    const result = await prisma_js_1.prisma.user.findMany({
        select: user_interface_js_1.publicUserSelectFields,
    });
    return result;
};
// get single user by id
const getSingleUserFromDB = async (id) => {
    const result = await prisma_js_1.prisma.user.findUniqueOrThrow({
        where: { id },
        select: user_interface_js_1.publicUserSelectFields,
    });
    if (result.status === 'SUSPENDED') {
        throw new AppError_js_1.default(403, 'User is blocked');
    }
    return result;
};
// update user by id
// delete user
const deleteUserFromDB = async (id) => {
    const userData = await prisma_js_1.prisma.user.findFirstOrThrow({
        where: {
            id,
        },
    });
    if (userData.status === 'SUSPENDED') {
        throw new AppError_js_1.default(403, 'User is blocked');
    }
    const result = await prisma_js_1.prisma.user.delete({
        where: {
            id,
        },
    });
    return result;
};
const getMyProfileFromDB = async (userId) => {
    return await prisma_js_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            role: true,
            status: true,
            emailVerified: true,
            joinedDate: true,
            createdAt: true,
            department: {
                select: {
                    id: true,
                    name: true,
                },
            },
            manager: {
                select: {
                    id: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                },
            },
            leaveBalances: true,
        },
    });
};
const updateMyProfileIntoDB = async (userId, payload) => {
    const result = await prisma_js_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            firstName: payload.firstName,
            lastName: payload.lastName,
            phone: payload.phone,
            avatarUrl: payload.avatarUrl,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            avatarUrl: true,
            role: true,
            status: true,
        },
    });
    return result;
};
exports.userService = {
    createUserIntoDB,
    getSingleUserFromDB,
    getAllUsersFromDB,
    deleteUserFromDB,
    getMyProfileFromDB,
    updateMyProfileIntoDB
};
//# sourceMappingURL=user.service.js.map