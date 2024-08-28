import { Sequelize } from 'sequelize';
import sequelize from '../utils/configs/database';
import Employee from './employee';
import Attendance from './attendance';

const models = {
  Employee,
  Attendance,
};

Object.values(models).forEach((model: any) => {
  if (model.associate) {
    model.associate(models);
  }
});

export { Sequelize, sequelize };
export default models;