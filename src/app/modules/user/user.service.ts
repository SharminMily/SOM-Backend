

import bcrypt from 'bcrypt';

import { prisma } from '../../shared/prisma.js';
import type { CreateUserDto, UpdateUserDto, UserResponse } from './user.interface.js';
import { Role } from '../../constants/enums.js';
import AppError from '../../errors/AppError.js';
import { jwtHelpers } from '../../helpers/jwtHelpers.js';

import { Prisma } from '@prisma/client';
import config from '../../config/index.js';


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

    const accessToken = jwtHelpers.createToken(
      tokenPayload,
      config.jwt.ACCESS_TOKEN_SECRET as string,
      config.jwt.ACCESS_TOKEN_EXPIRES_IN as string,
    );
    const refreshToken = jwtHelpers.createToken(
      tokenPayload,
      config.jwt.REFRESH_TOKEN_SECRET as string,
      config.jwt.REFRESH_TOKEN_EXPIRES_IN as string,
    );

    return {
      user: newUser,
      accessToken,
      refreshToken,
    };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        const field = (error.meta?.target as string[])?.[0];
        if (field === 'email') {
          throw new AppError(409, 'Email already exists');
        } else if (field === 'phoneNumber') {
          // console.error('Phone number conflict detected');
          throw new AppError(409, 'Phone number already exists');
        }
      }
    }

    throw new AppError(500, 'Failed to create or login user');
  }
};









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
  createUserIntoDB,
  getAllUsersFromDB,
//   getSingleUserFromDB,
//   deleteUserFromDB,
};