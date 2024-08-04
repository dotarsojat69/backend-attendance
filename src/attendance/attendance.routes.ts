import express from "express";
import { getAllAttendances, createNewAttendance, getAttendanceDetails } from "./attendance.controller";
import { verifyToken } from "../utils/middlewares/auth";
import upload from "../utils/configs/multer";

const router = express.Router();

router
  .route("/attendance")
  .get(
    (req, res, next) => verifyToken(req, res, next, ["admin"]),
    getAllAttendances
  )
  .post(
    (req, res, next) => verifyToken(req, res, next, ["user"]),
    upload.single("picture"),
    createNewAttendance
  );

router
  .route("/attendance/:id_user")
  .get(
    (req, res, next) => verifyToken(req, res, next, ["admin"]),
    getAttendanceDetails
  );

export default router;