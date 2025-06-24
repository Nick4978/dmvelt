"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const create_1 = __importDefault(require("./create"));
const get_1 = __importDefault(require("./get"));
const getAll_1 = __importDefault(require("./getAll"));
const update_1 = __importDefault(require("./update"));
const router = (0, express_1.Router)();
router.post("/create", create_1.default);
router.get("/get/:id", get_1.default);
router.get("/getAll", getAll_1.default);
router.put("/update/:id", update_1.default);
exports.default = router;
