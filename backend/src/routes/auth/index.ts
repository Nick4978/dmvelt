import express from "express";

import login from "./login";
import logout from "./logout";
import check from "./check";
import selectDealer from "./select-dealer";

const router = express.Router();

console.log("Auth route file loaded");

router.post("/login", login);
router.post("/logout", logout);
router.get("/check", check);
router.post("/select-dealer", selectDealer);

console.log("Auth routes loaded: /auth/check");

export default router;
