import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import models from '../models';

export async function register(req: Request, res: Response) {
  try {
    console.log('Request body:', req.body); // Log seluruh body request

    const { name, email, password, role } = req.body;

    console.log('Extracted data:', { name, email, password, role }); // Log data yang diekstrak

    // Validasi input
    if (!name || !email || !password || !role) {
      console.log('Missing required fields');
      return res.status(400).json({ message: 'All fields are required' });
    }

    const existingEmployee = await models.Employee.findOne({ where: { email } });
    
    console.log('Existing employee:', existingEmployee); // Log hasil pencarian karyawan yang sudah ada

    if (existingEmployee) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newEmployee = await models.Employee.create({
      name,
      email,
      password: hashedPassword,
      role,
    });

    res.status(201).json({ message: 'Employee registered successfully', employeeId: newEmployee.id });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function login(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    const employee = await models.Employee.findOne({ where: { email } });
    if (!employee) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, employee.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }
    const token = jwt.sign(
      { id: employee.id, email: employee.email, role: employee.role },
      process.env.JWT_SECRET as string,
      { expiresIn: '1d' }
    );
    res.json({ token, employee: { id: employee.id, name: employee.name, email: employee.email, role: employee.role } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}