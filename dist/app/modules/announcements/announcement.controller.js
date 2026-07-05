"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.announcementController = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_js_1 = __importDefault(require("../../helpers/catchAsync.js"));
const announcement_service_js_1 = require("./announcement.service.js");
const sendResponse_js_1 = __importDefault(require("../../helpers/sendResponse.js"));
const createAnnouncement = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await announcement_service_js_1.announcementService.createAnnouncement(req.user?.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.CREATED, success: true, message: 'Announcement created', data: result });
});
const getAllAnnouncements = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await announcement_service_js_1.announcementService.getAllAnnouncements(req.user?.id, req.user?.departmentId);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Announcements fetched', data: result });
});
const getAnnouncementById = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await announcement_service_js_1.announcementService.getAnnouncementById(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Announcement fetched', data: result });
});
const updateAnnouncement = (0, catchAsync_js_1.default)(async (req, res) => {
    const result = await announcement_service_js_1.announcementService.updateAnnouncement(req.params.id, req.body);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Announcement updated', data: result });
});
const deleteAnnouncement = (0, catchAsync_js_1.default)(async (req, res) => {
    await announcement_service_js_1.announcementService.deleteAnnouncement(req.params.id);
    (0, sendResponse_js_1.default)(res, { statusCode: http_status_1.default.OK, success: true, message: 'Announcement deleted', data: null });
});
exports.announcementController = { createAnnouncement, getAllAnnouncements, getAnnouncementById, updateAnnouncement, deleteAnnouncement };
//# sourceMappingURL=announcement.controller.js.map