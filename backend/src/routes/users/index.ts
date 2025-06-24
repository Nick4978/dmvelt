import { Router } from "express";
import createUser from "./create";
import getUser from "./get";
import getUsers from "./getAll";
import updateUser from "./update";

const router = Router();

router.post("/create", createUser);
router.get("/get/:id", getUser);
router.get("/getAll", getUsers);
router.put("/update/:id", updateUser);

export default router;
