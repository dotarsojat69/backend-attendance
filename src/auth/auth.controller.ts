import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { loginUser, getUserByEmail } from "./auth.model";
import { loginSchema } from "./auth.types";
import { zParse } from "../utils/zParse";

export const userLogin = async (req: Request, res: Response) => {
  try {
    const { body } = await zParse(loginSchema, req);

    const user = await getUserByEmail(body.email, true);

    if (user) {
      const comparePass = await bcrypt.compare(
        body.password,
        user.getDataValue("password")
      );

      if (comparePass) {
        const data = await loginUser(user, body.email);

        return res.status(200).json({
          message: "Login successfully",
          payload: { token: data },
        });
      } else if (!comparePass) {
        return res.status(400).json({ message: "Invalid password." });
      }
    }

    return res
      .status(400)
      .json({ message: "User not found, you must register first." });
  } catch (err: any) {
    return res.status(500).json({ message: err.message });
  }
};