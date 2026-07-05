"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildTokenPayload = void 0;
const buildTokenPayload = (user) => ({
    id: user.id,
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    profileImage: user.avatarUrl ?? undefined,
    role: user.role,
});
exports.buildTokenPayload = buildTokenPayload;
//# sourceMappingURL=auth.interface.js.map