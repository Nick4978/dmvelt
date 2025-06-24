import { Router } from "express";
import createDealer from "./create";
import getDealer from "./get";
import getDealers from "./getAll";
import updateDealer from "./update";

const router = Router();

router.post("/create", createDealer);
router.get("/get/:id", getDealer);
router.get("/getAll", getDealers);
router.put("/update/:id", updateDealer);

export default router;
