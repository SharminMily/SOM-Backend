export type TDepartmentPayload = {
  name: string;
  description?: string;
  headId?: string;
};

export interface UpdateDepartmentDto {
  name?: string;
  description?: string;
  headId?: string;
}

export interface DepartmentResponse {
  id: string;
  name: string;
  description?: string | null;
  headId?: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export const publicDepartmentSelectFields = {
  id: true,
  name: true,
  description: true,
  headId: true,
  createdAt: true,
  updatedAt: true,
  head: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      avatarUrl: true,
    },
  },
  users: {
    select: {
      id: true,
      firstName: true,
      lastName: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  },
} as const;