import express from 'express';
import { authenticateToken, authorizeAdmin } from '../utils/middlewares/auth';
import { getEmployees, removeEmployee, updateEmployeeInfo } from '../controllers/employeeController';


const router = express.Router();

router.get('/', authenticateToken, authorizeAdmin, getEmployees);
router.put('/:id', authenticateToken, authorizeAdmin, updateEmployeeInfo);
router.delete('/:id', authenticateToken, authorizeAdmin, removeEmployee);

export default router;