import { z } from 'zod';

export const attendanceSchema = z.object({
  id_user: z.string(),
  longitude: z.number({
    required_error: "longitude is required"
  }),
  latitude: z.number({
    required_error: "latitude is required"
  }),
  picture: z.string().optional(),
});

export type AttendanceCreateSchema = z.infer<typeof attendanceSchema>;

export type Attendance = AttendanceCreateSchema & {
  id: string;
  createdAt: Date;
};