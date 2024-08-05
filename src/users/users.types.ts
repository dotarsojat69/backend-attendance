import { z } from "zod";
import { querySchema } from "../utils/types/type";

export const userSchema = z.object({
  nip: z.string({
        required_error: "NIK is required",
      }),
  name: z.string({
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
  profile_picture: z.string().optional(),
});

export const bodyRegister = z.object({
  nip: z.string({
        required_error: "NIP is required",
      }),
  name: z.string({
    required_error: "Name is required",
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
});

export const registerSchema = z.object({
  query: querySchema,
  body: bodyRegister,
});

export type RegistSchema = z.infer<typeof bodyRegister>;

export type UserUpdateSchema = z.infer<typeof userSchema>;