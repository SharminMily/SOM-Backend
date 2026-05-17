import { createRequire as _createRequire } from "module";
const __require = _createRequire(import.meta.url);
const app = __require("./app");
let server;
const port = 5000;
const bootstrap = async () => {
    server = app.listen(port, () => {
        console.log(`Example app listening on port ${port}`);
    });
};
bootstrap();
//# sourceMappingURL=server.js.map