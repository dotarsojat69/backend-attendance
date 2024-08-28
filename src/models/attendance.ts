import { Model, DataTypes } from 'sequelize';
import sequelize from '../utils/configs/database';

class Attendance extends Model {
  public id!: number;
  public employeeId!: number;
  public checkIn!: Date;
  public checkOut!: Date | null;
  public location!: string;
  public photoUrl!: string;

  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  static associate(models: any) {
    Attendance.belongsTo(models.Employee, { foreignKey: 'employeeId' });
  }
}

Attendance.init(
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    employeeId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    checkIn: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    checkOut: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    photoUrl: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: 'attendance',
    timestamps: true,
  }
);

export default Attendance;