export interface TLoginPayload {
  email: string;
  password: string;
}

export interface TRefreshTokenPayload {
  refreshToken: string;
}

export interface TForgotPasswordPayload {
  email: string;
}

export interface TResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface TChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export interface TVerifyEmailPayload {
  token: string;
}



export const buildTokenPayload = (user: {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: any;
  status: any;
  departmentId?: string | null;
  managerId?: string | null;
  joinedDate?: Date | null;
}) => ({
  id: user.id,
  email: user.email,
  name: `${user.firstName} ${user.lastName}`,
  profileImage: user.avatarUrl ?? undefined,
  role: user.role,
});


export interface IAuthenticatedUser {
  id: string;
   firstName: string;
  lastName: string;
  email: string;
  role:  " ADMIN" | "MANAGER" |
 " EMPLOYEE";
  avatarUr?: string;
  iat?: number;
  exp?: number;
}
