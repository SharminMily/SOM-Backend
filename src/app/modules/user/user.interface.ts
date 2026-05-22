// src/modules/user/user.types.ts

import type { Role, UserStatus } from "../../constants/enums.js";


// src/modules/user/user.types.ts


export interface CreateUserDto {
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

export interface UserResponse {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: Role;
  status: UserStatus;
  departmentId?: string | null;
  managerId?: string | null;
  joinedDate?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}






























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
  