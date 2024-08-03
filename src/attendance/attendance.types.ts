import { z } from 'zod';

export const attendanceSchema = z.object({
  id_user: z.string(),
  longitude: z.number(),
  latitude: z.number(),
  picture: z.string(),
});

export type AttendanceCreateSchema = z.infer<typeof attendanceSchema>;

export type Attendance = AttendanceCreateSchema & {
  id: string;
  createdAt: Date;
};