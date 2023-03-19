"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const CatchAsync = (func) => {
    return (req, res, next) => {
        func(req, res, next).catch(next);
    };
};
exports.default = CatchAsync;
