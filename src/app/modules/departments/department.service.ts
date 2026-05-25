import AppError from "../../errors/AppError.js";
import { prisma } from "../../shared/prisma.js";
import { publicDepartmentSelectFields, type TDepartmentPayload, type UpdateDepartmentDto } from "./department.interface.js";


// create department
const createDepartmentIntoDB = async (data: TDepartmentPayload) => {
  const existing = await prisma.department.findUnique({
    where: { name: data.name },
  });

  if (existing) {
    throw new AppError(409, 'Department name already exists');
  }

  const result = await prisma.department.create({
    data,
    select: publicDepartmentSelectFields,
  });

  return result;
};

// get all departments
const getAllDepartmentsFromDB = async () => {
  const result = await prisma.department.findMany({
    select: publicDepartmentSelectFields,
  });
  return result;
};

// get single department
const getSingleDepartmentFromDB = async (id: string) => {
  const result = await prisma.department.findUniqueOrThrow({
    where: { id },
    select: publicDepartmentSelectFields,
  });
  return result;
};

// update department
const updateDepartmentIntoDB = async (id: string, data: UpdateDepartmentDto) => {
  await prisma.department.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.department.update({
    where: { id },
    data,
    select: publicDepartmentSelectFields,
  });

  return result;
};

// delete department
const deleteDepartmentFromDB = async (id: string) => {
  await prisma.department.findUniqueOrThrow({
    where: { id },
  });

  const result = await prisma.department.delete({
    where: { id },
  });

  return result;
};

export const departmentService = {
  createDepartmentIntoDB,
  getAllDepartmentsFromDB,
  getSingleDepartmentFromDB,
  updateDepartmentIntoDB,
  deleteDepartmentFromDB,
};