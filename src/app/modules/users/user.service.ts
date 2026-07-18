

import bcrypt from 'bcrypt';

import { prisma } from '../../shared/prisma.js';
import { publicUserSelectFields, type TUserPayload,  } from './user.interface.js';
import { Role } from '../../constants/enums.js';
import AppError from '../../errors/AppError.js';
import { jwtHelpers } from '../../helpers/jwtHelpers.js';

import { Prisma, type User } from '@prisma/client';
import config from '../../config/index.js';


// createUserIntoDB
const createUserIntoDB = async (userData: TUserPayload) => {
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
  const result = await prisma.user.findMany({
    select: publicUserSelectFields,
   });
  return result;
};
// get single user by id
const getSingleUserFromDB = async (id: string) => {
  const result = await prisma.user.findUniqueOrThrow({
    
    where: { id },  
    select: publicUserSelectFields,
   
  });
  if (result.status === 'SUSPENDED') {
    throw new AppError(403, 'User is blocked');
  }
  return result;
};

// delete user
const deleteUserFromDB = async (id: string) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });
  if (userData.status === 'SUSPENDED') {
    throw new AppError(403, 'User is blocked');
  }
  const result = await prisma.user.delete({
    where: {
      id,
    },
  });
  return result;
};

// update user by id
const updateUserFromDB = async (id: string, payload: Partial<User>) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      id,
    },
  });

  if (userData.status === 'SUSPENDED') {
    throw new AppError(403, 'User is blocked');
  }

  // sensitive fields যেগুলো এখান দিয়ে update করা উচিত না
  const restrictedFields = ['id', 'password', 'email', 'createdAt', 'updatedAt'];
  restrictedFields.forEach((field) => {
    delete (payload as any)[field];
  });

  const result = await prisma.user.update({
    where: {
      id,
    },
    data: payload,
  });

  return result;
};

const getMyProfileFromDB = async (userId: string) => {
  return await prisma.user.findUnique({
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

const updateMyProfileIntoDB = async (
  userId: string,
  payload: Partial<User>
) => {
  const result = await prisma.user.update({
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

export const userService = {
  createUserIntoDB,
  getSingleUserFromDB,
  getAllUsersFromDB,
  deleteUserFromDB,
  updateUserFromDB,
  getMyProfileFromDB,
  updateMyProfileIntoDB
};