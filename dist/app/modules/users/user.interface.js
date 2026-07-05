"use strict";
// src/modules/user/user.types.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.publicUserSelectFields = void 0;
exports.publicUserSelectFields = {
    id: true,
    email: true,
    firstName: true,
    lastName: true,
    phone: true,
    avatarUrl: true,
    role: true,
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
    status: true,
    departmentId: true,
    managerId: true,
    joinedDate: true,
    createdAt: true,
    updatedAt: true,
    // excluded: password
};
// export type TUserPayload = {
//   name: string;
//   email: string;
//   password: string;
//   phoneNumber: string;
//   gender: 'Male' | 'Female' | 'Other';
//   occupation: string;
//   address: string;
//   bio: string;
//   profileImage: string;
//   };
// export const publicUserSelectFields = {
//   id: true,
//   name: true,
//   email: true,
//   phoneNumber: true,
//   profileImage: true,
//   role: true,
//   isDeleted: true,
//   isBlocked: true,
//   createdAt: true,
//   updatedAt: true,
// } ;
// export interface ITokenUser {
//   id:string
//   name: string;
//   email: string;
//   role: "admin" | "manager" | "employee";
//   profileImage: string;
//   iat: number;
//   exp: number;
// }
//# sourceMappingURL=user.interface.js.map