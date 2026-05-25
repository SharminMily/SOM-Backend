import { Role, UserStatus } from '../constants/enums.js';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        name?: string;
        role: Role;
        profileImage?: string | null;
      };
    }
  }
}

export {};