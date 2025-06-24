import { Router } from "express";
import createLien from "./create";
import getLien from "./get";
import getLiens from "./getAll";
import updateLien from "./update";

const router = Router();

router.post("/create", createLien);
router.get("/get/:id", getLien);
router.get("/getAll", getLiens);
router.put("/update/:id", updateLien);

export default router;
