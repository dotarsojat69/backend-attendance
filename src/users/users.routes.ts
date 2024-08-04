import express from "express";

import { userGet, userUpdate, userDelete, userGetDetail } from "./users.controller";
import { verifyToken } from "../utils/middlewares/auth";
import upload from "../utils/configs/multer";
import { userSignup } from "../users/users.controller";

const router = express.Router();

router.post("/register", userSignup);

router
  .route("/users")
  .post(
    (req, res, next) => verifyToken(req, res, next, ["admin"]), userSignup)
  .get(
    (req, res, next) => verifyToken(req, res, next, ["admin"]),
    userGet
  )
  .put(
    (req, res, next) => verifyToken(req, res, next, ["admin"]),
    upload.single("profile_picture"),
    userUpdate
  )
  .delete(
    (req, res, next) => verifyToken(req, res, next, ["admin"]),
    userDelete
  );

  router
  .route("/users/:id_user")
  .get(
    (req, res, next) => verifyToken(req, res, next, ["user", "admin"]),
    userGetDetail
  )
  .put(
    (req, res, next) => verifyToken(req, res, next, ["admin"]),
    upload.single("profile_picture"),
    userUpdate
  );

export default router;