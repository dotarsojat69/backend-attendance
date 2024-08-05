import { Request, Response } from "express";

import {
  getUserByIdToken,
  updateUserByIdToken,
  deleteUserByIdToken,
  getUserById,
  regisUser,
  getUserByEmail,
} from "./users.model";

import { registerSchema, userSchema } from "./users.types";
import { nonBodySchema, bodySchema } from "../utils/types/type";
import { zParse } from "../utils/zParse";

export const userSignup = async (req: Request, res: Response) => {
  try {
    const { query, body } = await zParse(registerSchema, req);

    const oldUser = await getUserByEmail(body.email, false);

    if (oldUser?.isSoftDeleted()) {
      return res.status(409).json({
        message: "Cannot use registered email, please try another one.",
      });
    }

    if (oldUser) {
      return res
        .status(409)
        .json({ message: "User already exist, please login." });
    }

    if (query.overwrite === "true") {
      await regisUser(body);
    }

    return res.status(201).json({ message: "User registered, please login." });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const userGet = async (req: Request, res: Response) => {
  try {
    const data = await getUserByIdToken(req);
    if (data) {
      return res.status(200).json({ message: "User found.", payload: data });
    } else {
      return res.status(404).json({ message: "User not found." });
    }
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const userUpdate = async (req: Request, res: Response) => {
  try {
    const { query, body } = await zParse(bodySchema(userSchema), req);

    if (query.overwrite === "true") {
      const data = await updateUserByIdToken(req, body);

      if (!data) {
        return res.status(400).json({ message: "Failed to update user." });
      }
    }

    return res.status(200).json({
      message: "User updated successfully.",
    });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const userDelete = async (req: Request, res: Response) => {
  try {
    const { query } = await zParse(nonBodySchema, req);

    if (query.overwrite === "true") {
      const data = await deleteUserByIdToken(req);

      if (!data) {
        return res
          .status(400)
          .json({ message: "Failed to delete user, user not found." });
      }
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};

export const userGetDetail = async (req: Request, res: Response) => {
  const { id_user } = req.params;

  try {
    const data = await getUserById(id_user);

    if (!data) {
      return res.status(404).json({ message: "User tidak ditemukan" });
    }

    res.status(200).json({
      message: "Detail user berhasil diambil",
      data,
    });
  } catch (err: any) {
    console.error(`Error saat mengambil detail user: ${err.message}`);
    res.status(500).json({
      message:
        "Terjadi kesalahan saat mengambil detail user. Silakan coba lagi nanti.",
    });
  }
};