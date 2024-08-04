import { z } from "zod";

import { querySchema } from "../utils/types/type";

export const bodyLogin = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Not a valid email"),
  password: z.string({
    required_error: "Password is required",
  }),
});

export const loginSchema = z.object({
  body: bodyLogin,
});

export type LoginSchema = z.infer<typeof bodyLogin>;