"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const login_1 = __importDefault(require("./login"));
const logout_1 = __importDefault(require("./logout"));
const check_1 = __importDefault(require("./check"));
const select_dealer_1 = __importDefault(require("./select-dealer"));
const router = express_1.default.Router();
router.post("/login", login_1.default);
router.post("/logout", logout_1.default);
router.get("/check", check_1.default);
router.post("/select-dealer", select_dealer_1.default);
exports.default = router;
