import { Request, Response } from 'express';
import models from '../models';

export async function getEmployees(req: Request, res: Response) {
  try {
    const employees = await models.Employee.findAll({
      attributes: ['id', 'name', 'email', 'role'],
    });
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function updateEmployeeInfo(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    await models.Employee.update({ name, email, role }, { where: { id } });
    res.json({ message: 'Employee updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

export async function removeEmployee(req: Request, res: Response) {
  try {
    const { id } = req.params;
    await models.Employee.destroy({ where: { id } });
    res.json({ message: 'Employee deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}