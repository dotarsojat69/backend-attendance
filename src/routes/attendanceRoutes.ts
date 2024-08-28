import express from 'express';
import { checkIn, checkOut, getEmployeeAttendance, getAllAttendanceRecords } from '../controllers/attendanceController';
import { authenticateToken, authorizeAdmin } from '../utils/middlewares/auth';
import upload from '../utils/configs/multer';

const router = express.Router();

router.post('/check-in', authenticateToken, upload.single('photo'), checkIn);
router.put('/check-out/:id', authenticateToken, checkOut);
router.get('/employee/:employee_id', authenticateToken, getEmployeeAttendance);
router.get('/all', authenticateToken, authorizeAdmin, getAllAttendanceRecords);

export default router;