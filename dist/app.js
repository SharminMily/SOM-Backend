"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const index_js_1 = __importDefault(require("./app/routes/index.js"));
const notFound_js_1 = __importDefault(require("./app/middlewares/notFound.js"));
const globalErrorhandler_js_1 = __importDefault(require("./app/middlewares/globalErrorhandler.js"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const allowedOrigins = [
    "https://som-teal.vercel.app",
];
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true,
}));
;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.get('/', (req, res) => {
    res.status(http_status_1.default.OK).json({
        success: true,
        message: 'Server Is Running',
    });
});
app.use('/api', index_js_1.default);
app.use(notFound_js_1.default);
app.use(globalErrorhandler_js_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map