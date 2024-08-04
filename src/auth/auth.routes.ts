import express from "express";

import { userLogin } from "./auth.controller";

const router = express.Router();

router.post("/login", userLogin);

export default router;