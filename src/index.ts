import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sequelize } from './models';
import authRoutes from './routes/authRoutes';
import attendanceRoutes from './routes/attendanceRoutes';
import employeeRoutes from './routes/employeeRoutes';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/employees', employeeRoutes);
app.use('/api/attendance', attendanceRoutes);

sequelize.sync().then(() => {
  console.log('Database synced');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
});