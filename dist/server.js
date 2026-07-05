"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_js_1 = __importDefault(require("./app.js"));
const index_js_1 = __importDefault(require("./app/config/index.js"));
const port = index_js_1.default.port || 5000;
async function main() {
    const server = app_js_1.default.listen(port, () => {
        // console.log('Sever is running on port:', port);
    });
}
main();
//# sourceMappingURL=server.js.map