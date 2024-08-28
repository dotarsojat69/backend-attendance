import { Request, Response } from 'express';
import models from '../models';
import cloudinary from '../utils/configs/cloudinary';

export async function checkIn(req: Request, res: Response) {
  try {
    const { employee_id, location } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(file.path);
    const attendance = await models.Attendance.create({
      employeeId: employee_id,
      checkIn: new Date(),
      location,
      photoUrl: result.secure_url,
    });
    res.status(201).json({ message: 'Check-in successful', attendanceId: attendance.id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function checkOut(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await models.Attendance.update({ checkOut: new Date() }, { where: { id } });
    res.json({ message: 'Check-out successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getEmployeeAttendance(req: Request, res: Response) {
  try {
    const { employee_id } = req.params;
    const attendance = await models.Attendance.findAll({
      where: { employeeId: employee_id },
      order: [['checkIn', 'DESC']],
    });
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function getAllAttendanceRecords(req: Request, res: Response) {
  try {
    const attendance = await models.Attendance.findAll({
      order: [['checkIn', 'DESC']],
      include: [{ model: models.Employee, attributes: ['name', 'email'] }],
    });
    res.json(attendance);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}