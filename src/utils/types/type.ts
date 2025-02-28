import { z } from "zod";

export const querySchema = z.object({
  page: z.string().optional().default("1"),
  overwrite: z.enum(["true", "false"]).optional().default("false"),
  query: z.string().optional().default(""),
  sort: z.string().optional().default(""),
  filter: z.string().optional().default(""),
  limit: z.string().optional().default("10"),
});

export const nonBodySchema = z.object({
  query: querySchema,
});

export function bodySchema<T extends z.ZodRawShape>(schema: z.ZodObject<T>) {
  return z.object({
    query: querySchema,
    body: schema,
  });
}

export type QuerySchema = z.infer<typeof querySchema>;