"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressError = void 0;
class ExpressError extends Error {
    constructor(message, statusCode) {
        super();
        this.message = message;
        this.statusCode = statusCode;
    }
}
exports.ExpressError = ExpressError;
