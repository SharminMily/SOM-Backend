

import bcrypt from 'bcrypt';

import { prisma } from '../../shared/prisma.js';
import type { CreateUserDto, UpdateUserDto, UserResponse } from './user.interface.js';
import { Role } from '../../constants/enums.js';
import AppError from '../../errors/AppError.js';
import { jwtHelpers } from '../../helpers/jwtHelpers.js';
import { config } from 'dotenv';
import { PrismaClient } from '@prisma/client/extension';
// createUserIntoDB

const createUserIntoDB = async (userData: CreateUserDto) => {
  const { password, ...restData } = userData;
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email: restData.email },
    });

    if (existingUser) {
      throw new AppError(409, 'Email already exists');
    }

    const hashPassword = await bcrypt.hash(password, 12);

    const newUserData = {
      ...restData,
      password: hashPassword,
    };

    // Create new user
    const newUser = await prisma.user.create({
      data: newUserData,
    });

    // token payload
    // const tokenPayload = {
    //   id: newUser.id,
    //   name: newUser.name,
    //   email: newUser.email,
    //   role: newUser.role,
    //   profileImage: newUser.profileImage ?? undefined,
    //   phoneNumber: newUser.phoneNumber,
    //   address: newUser.address,
    //   occupation: newUser.occupation,
    //   bio: newUser.bio,
    //   isDeleted: newUser.isDeleted,
    //   isBlocked: newUser.isBlocked,
    // };

    // const accessToken = jwtHelpers.createToken(
    //   tokenPayload,
    //   config.jwt.ACCESS_TOKEN_SECRET as string,
    //   config.jwt.ACCESS_TOKEN_EXPIRES_IN as string,
    // );
    // const refreshToken = jwtHelpers.createToken(
    //   tokenPayload,
    //   config.jwt.REFRESH_TOKEN_SECRET as string,
    //   config.jwt.REFRESH_TOKEN_EXPIRES_IN as string,
    // );

    return {
      user: newUser,
      // accessToken,
      // refreshToken,
    };
  } catch (error) {
    // if (error instanceof PrismaClient.PrismaClientKnownRequestError) {
    //   if (error.code === 'P2002') {
    //     const field = (error.meta?.target as string[])?.[0];
    //     if (field === 'email') {
    //       throw new AppError(409, 'Email already exists');
    //     } else if (field === 'phoneNumber') {
    //       // console.error('Phone number conflict detected');
    //       throw new AppError(409, 'Phone number already exists');
    //     }
    //   }
    // }

    // throw new AppError(500, 'Failed to create or login user');
  }
};

// export class UserService 
//   async createUser(data: CreateUserDto): Promise<UserResponse> {
//     const hashedPassword = await bcrypt.hash(data.password, 10);

//     const user = await prisma.user.create({
//       data: {
//         email: data.email,
//         password: hashedPassword,
//         firstName: data.firstName,
//         lastName: data.lastName,
//         phone: data.phone,
//         departmentId: data.departmentId,
//         managerId: data.managerId,
//         role: data.role || Role.EMPLOYEE,
//       },
//       select: {
//         id: true,
//         email: true,
//         firstName: true,
//         lastName: true,
//         phone: true,
//         avatarUrl: true,
//         role: true,
//         status: true,
//         departmentId: true,
//         managerId: true,
//         joinedDate: true,
//         createdAt: true,
//         updatedAt: true,
//       },
//     });

//     return user;
//   }

  // ... other methods remain similar
  // async updateUser(id: string, data: UpdateUserDto): Promise<UserResponse> {
  //   return prisma.user.update({
  //     where: { id },
  //     data,
  //     select: {
  //       id: true,
  //       email: true,
  //       firstName: true,
  //       lastName: true,
  //       phone: true,
  //       avatarUrl: true,
  //       role: true,
  //       status: true,
  //       departmentId: true,
  //       managerId: true,
  //       joinedDate: true,
  //       createdAt: true,
  //       updatedAt: true,
  //     },
  //   });
  // }


// get User
const getAllUsersFromDB = async () => {
//   const result = await prisma.user.findMany({
//     select: publicUserSelectFields,
//   });
  return ;
};


// get single user by id

// delete user

//update user


export const userService = {
//   createUserIntoDB,
  getAllUsersFromDB,
//   getSingleUserFromDB,
//   deleteUserFromDB,
};