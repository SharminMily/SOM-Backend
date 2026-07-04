import bcrypt from 'bcrypt';
import { prisma } from '../../shared/prisma.js';
import AppError from '../../errors/AppError.js';
import { jwtHelpers } from '../../helpers/jwtHelpers.js';
import config from '../../config/index.js';
import {
  type TLoginPayload,
  type TForgotPasswordPayload,
  type TResetPasswordPayload,
  type TChangePasswordPayload,
  buildTokenPayload,
} from './auth.interface.js';
import { sendEmail } from '../../helpers/sendEmail.js';


// login
const loginUser = async (data: TLoginPayload) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });
  if (!userData) {
    throw new AppError(404, 'User not found!');
  }
  if (userData.status === 'SUSPENDED') {
    throw new AppError(403, 'Your account is suspended');
  }

  const isCorrectPassword: boolean = await bcrypt.compare(
    data.password,
    userData.password,
  );

  if (!isCorrectPassword) {
    throw new AppError(403, 'You have given a wrong password!');
  }

  // token payload
  const tokenPayload = {
    id: userData.id,
      email: userData.email,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role,
      status: userData.status,
      avatarUrl: userData.avatarUrl,
  };

  // access token
  const accessToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.ACCESS_TOKEN_SECRET,
    config.jwt.ACCESS_TOKEN_EXPIRES_IN as string,
  );

  // refresh token
  const refreshToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.REFRESH_TOKEN_SECRET as string,
    config.jwt.REFRESH_TOKEN_EXPIRES_IN as string,
  );
   await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId: userData.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return {
    accessToken,
    refreshToken,
  };
};

// silent refresh
const refreshAccessToken = async (refreshToken: string) => {
  // verify token is valid
  const decoded = jwtHelpers.verifyToken(
    refreshToken,
    config.jwt.REFRESH_TOKEN_SECRET,
  );

  // check token exists in db and not blacklisted
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
    include: { user: true },
  });

  if (!storedToken || storedToken.blacklisted) {
    throw new AppError(403, 'Invalid or expired refresh token');
  }

  if (storedToken.expiresAt < new Date()) {
    throw new AppError(403, 'Refresh token expired');
  }

  if (storedToken.user.status === 'SUSPENDED') {
    throw new AppError(403, 'Your account is suspended');
  }

  const tokenPayload = buildTokenPayload(storedToken.user);

  // token rotation — blacklist old, issue new
  const newRefreshToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.REFRESH_TOKEN_SECRET,
    config.jwt.REFRESH_TOKEN_EXPIRES_IN,
  );

  const newAccessToken = jwtHelpers.createToken(
    tokenPayload,
    config.jwt.ACCESS_TOKEN_SECRET,
    config.jwt.ACCESS_TOKEN_EXPIRES_IN,
  );

  // blacklist old refresh token
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { blacklisted: true },
  });

  // store new refresh token
  await prisma.refreshToken.create({
    data: {
      token: newRefreshToken,
      userId: storedToken.userId,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    },
  });

  return { accessToken: newAccessToken, 
    refreshToken: newRefreshToken,
    user: {
      id: storedToken.user.id,
      email: storedToken.user.email,
      firstName: storedToken.user.firstName,
      lastName: storedToken.user.lastName,
      role: storedToken.user.role,
      status: storedToken.user.status,
      avatarUrl: storedToken.user.avatarUrl,
    },
   };
};

// logout
const logoutUser = async (refreshToken: string) => {
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token: refreshToken },
  });

  if (!storedToken) {
    throw new AppError(404, 'Token not found');
  }

  // blacklist the token
  await prisma.refreshToken.update({
    where: { token: refreshToken },
    data: { blacklisted: true },
  });
};

// verify email
const verifyEmail = async (token: string) => {
  const user = await prisma.user.findFirst({
    where: {
      emailVerifyToken: token,
      emailVerifyExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(400, 'Invalid or expired verification token');
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: true,
      emailVerifyToken: null,
      emailVerifyExpires: null,
    },
  });
};

// forgot password — send OTP email
const forgotPassword = async (payload: TForgotPasswordPayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError(404, 'No account found with this email');
  }

  // generate 6 digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

  await prisma.user.update({
    where: { id: user.id },
    data: {
      passwordResetOtp: otp,
      passwordResetExpires: otpExpires,
    },
  });

  await sendEmail({
    to: user.email,
    subject: 'Password Reset OTP',
    html: `
      <h2>Password Reset Request</h2>
      <p>Your OTP for password reset is:</p>
      <h1 style="letter-spacing: 4px;">${otp}</h1>
      <p>This OTP expires in 15 minutes.</p>
      <p>If you did not request this, ignore this email.</p>
    `,
  });
};

// reset password with OTP
const resetPassword = async (payload: TResetPasswordPayload) => {
  const user = await prisma.user.findFirst({
    where: {
      passwordResetOtp: payload.token,
      passwordResetExpires: { gt: new Date() },
    },
  });

  if (!user) {
    throw new AppError(400, 'Invalid or expired OTP');
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: {
      password: hashedPassword,
      passwordResetOtp: null,
      passwordResetExpires: null,
    },
  });
};

// change password (logged in user)
const changePassword = async (
  userId: string,
  payload: TChangePasswordPayload,
) => {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
  });

  const isMatch = await bcrypt.compare(payload.currentPassword, user.password);
  if (!isMatch) {
    throw new AppError(401, 'Current password is incorrect');
  }

  const hashedPassword = await bcrypt.hash(payload.newPassword, 12);

  await prisma.user.update({
    where: { id: user.id },
    data: { password: hashedPassword },
  });
};



const getCurrentUser = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      role: true,
      status: true,
      avatarUrl: true,
      departmentId: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,      
    },
  });
  // console.log('Fetched user from DB:', user);

  if (!user) {
    throw new AppError(404, 'User not found');
  }

  if (user.status === 'SUSPENDED') {
    throw new AppError(403, 'Your account is suspended');
  }

  return user;
};


export const authService = {
  loginUser,
  refreshAccessToken,
  logoutUser,
  verifyEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getCurrentUser
};