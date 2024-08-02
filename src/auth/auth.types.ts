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

export const bodyRegister = z.object({
  nik: z.string({
        required_error: "NIK is required",
      }),
  full_name: z.string({
    required_error: "Full name is required",
  }),
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Not a valid email"),
  password: z.string({
    required_error: "Password is required",
  }),
  role: z.enum(["user", "admin"], { required_error: "Role is required" }),
  position: z.string({
    required_error: "Position is required",
  }),
  working_hour: z.string({
    required_error: "Working Hour is required",
  }),
});

export const loginSchema = z.object({
  body: bodyLogin,
});

export const registerSchema = z.object({
  query: querySchema,
  body: bodyRegister,
});

export type RegistSchema = z.infer<typeof bodyRegister>;
export type LoginSchema = z.infer<typeof bodyLogin>;