import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import authRouter from "../auth/auth.routes";
import usersRouter from "../users/users.routes";

const app = express();
const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api/v1", authRouter);
app.use("/api/v1", usersRouter);

app.use((req: Request, res: Response, next: NextFunction) => {
  return res.status(404).json({
    code: 404,
    message: "No such route exists",
  });
});

export default app;