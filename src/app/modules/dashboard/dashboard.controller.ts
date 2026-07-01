
import status from "http-status";

import catchAsync from "../../helpers/catchAsync.js";
import sendResponse from "../../helpers/sendResponse.js";
import AppError from "../../errors/AppError.js";

import { dashboardService } from "./dashboard.service.js";
import type { Request, Response } from "express";

const getEmployeeDashboard = catchAsync(
  async (req: Request, res: Response) => {
    if (!req.user) {
      throw new AppError(status.UNAUTHORIZED, "Unauthorized");
    }

    const result = await dashboardService.getEmployeeDashboard(req.user.id);

    sendResponse(res, {
      statusCode: status.OK,
      success: true,
      message: "Employee dashboard fetched successfully",
      data: result,
    });
  }
);

export const dashboardController = {
  getEmployeeDashboard,
};