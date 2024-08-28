import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/configs/database';

class Employee extends Model {
  public id!: number;
  public name!: string;
  public email!: string;
  public password!: string;
  public role!: 'employee' | 'admin';

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Employee.hasMany(models.Attendance, { foreignKey: 'employeeId' });
  }
}

Employee.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('employee', 'admin'),
      defaultValue: 'employee',
    },
  },
  {
    sequelize,
    tableName: 'employees',
    timestamps: true,
  }
);

export default Employee;