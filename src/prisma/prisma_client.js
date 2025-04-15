"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.prismaGlobalClient = void 0;
// lib/prisma.ts
var client_1 = require("@prisma/client");
var globalForPrisma = globalThis;
exports.prismaGlobalClient = (_a = globalForPrisma.prisma) !== null && _a !== void 0 ? _a : new client_1.PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
});
if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = exports.prismaGlobalClient;
}
