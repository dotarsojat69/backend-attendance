import { Request, Response } from "express";
import { getAttendances, createAttendance, getAttendanceById } from "./attendance.model";
import { attendanceSchema } from "./attendance.types";
import { zParse } from "../utils/zParse";
import { bodySchema, nonBodySchema } from "../utils/types/type";

export const getAllAttendances = async (req: Request, res: Response) => {
  try {
    const { query } = await zParse(nonBodySchema, req);
    const attendances = await getAttendances(query);
    if (attendances) {
        res.status(200).json({ message: "Attendances retrieved successfully", payload: attendances });
    } else {
        return res.status(404).json({message: "No attendance found."});
    }
  } catch (err: any) {
    console.error(`Error fetching attendances: ${err.message}`);
    res.status(500).json({ message: "Failed to retrieve attendances" });
  }
};

export const createNewAttendance = async (req: Request, res: Response) => {
  try {
    const { body } = await zParse(bodySchema(attendanceSchema), req);
    const attendance = await createAttendance(req, body);
    res.status(201).json({ message: "Attendance created successfully", data: attendance });
  } catch (err: any) {
    console.error(`Error creating attendance: ${err.message}`);
    res.status(400).json({ message: "Failed to create attendance" });
  }
};

export const getAttendanceDetails = async (req: Request, res: Response) => {
  try {
    const { id_attendance } = req.params;
    const attendance = await getAttendanceById(id_attendance);
    if (attendance) {
      res.status(200).json({ message: "Attendance details retrieved successfully", data: attendance });
    } else {
      res.status(404).json({ message: "Attendance not found" });
    }
  } catch (err: any) {
    console.error(`Error fetching attendance details: ${err.message}`);
    res.status(500).json({ message: "Failed to retrieve attendance details" });
  }
};