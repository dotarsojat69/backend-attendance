import { z } from "zod";
import { querySchema } from "../utils/types/type";

export const userSchema = z.object({
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
  position: z.string({
    required_error: "Position is required",
  }),
  working_hour: z.string({
    required_error: "Working Hour is required",
  }),
  location: z.string({
    required_error: "Location is required",
  }),
  profile_picture: z.string().optional(),
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
  location: z.string({
    required_error: "location Hour is required",
  }),
});

export const registerSchema = z.object({
  query: querySchema,
  body: bodyRegister,
});

export type RegistSchema = z.infer<typeof bodyRegister>;

export type UserUpdateSchema = z.infer<typeof userSchema>;