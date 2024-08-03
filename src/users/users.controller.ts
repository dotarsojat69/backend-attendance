import { Request, Response } from "express";

import {
  getUserByIdToken,
  updateUserByIdToken,
  deleteUserByIdToken,
  getUserById,
} from "./users.model";

import { userSchema } from "./users.types";
import { nonBodySchema, bodySchema } from "../utils/types/type";
import { zParse } from "../utils/zParse";

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
  const { id } = req.params;
  const { role } = req.token; // Assuming we store role in token

  if (role !== 'user') {
    return res.status(403).json({ message: "Only users can access this endpoint" });
  }

  try {
    const data = await getUserById(id, role);
    res.status(200).json({ message: "User details retrieved successfully", data });
  } catch (err: any) {
    console.error(`Error fetching user details: ${err.message}`);
    
    if (err.message === 'Unauthorized access') {
      res.status(403).json({ message: "You don't have permission to view this user" });
    } else if (err.message === 'User not found') {
      res.status(404).json({ message: "We couldn't find the user you're looking for" });
    } else {
      res.status(500).json({ message: "Something went wrong on our end. Please try again later." });
    }
  }
};