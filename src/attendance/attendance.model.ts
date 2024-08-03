import { DataTypes } from "sequelize";
import sequelize from "../utils/configs/database";
import Users from "../users/users.model";

const Attendance = sequelize.define(
  "attendance",
  {
    id_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    picture: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

Attendance.belongsTo(Users, { foreignKey: 'id_user' });

export const getAttendances = async () => {
  return await Attendance.findAll({
    include: [{ model: Users, attributes: ['full_name'] }],
  });
};

export const createAttendance = async (attendanceData: any) => {
  return await Attendance.create(attendanceData);
};

export const getAttendanceById = async (id: string) => {
  return await Attendance.findByPk(id, {
    include: [{ model: Users, attributes: ['full_name'] }],
  });
};

export default Attendance;