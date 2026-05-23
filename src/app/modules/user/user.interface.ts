// src/modules/user/user.types.ts

import type { Role, UserStatus } from "../../constants/enums.js";


// src/modules/user/user.types.ts


export type TUserPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
  departmentId?: string;
  managerId?: string;
  role?: Role;           // Optional, defaults to EMPLOYEE
}

export interface UpdateUserDto {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatarUrl?: string;
  departmentId?: string;
  managerId?: string;
  role?: Role;
  status?: UserStatus;
}

export const publicUserSelectFields = {
  id: true,
  email: true,
  firstName: true,
  lastName: true,
  phone: true,
  avatarUrl: true,
  role: true,
  status: true,
  departmentId: true,
  managerId: true,
  joinedDate: true,
  createdAt: true,
  updatedAt: true,
  // excluded: password
} as const;





























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
  