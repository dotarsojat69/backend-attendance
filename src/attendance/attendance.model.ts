import { DataTypes, Op, Order, WhereOptions } from "sequelize";
import { Request } from "express";
import sequelize from "../utils/configs/database";
import Users from "../users/users.model";
import { AttendanceCreateSchema } from "./attendance.types";
import { QuerySchema } from "../utils/types/type";

const cloudinary = require("../utils/configs/cloudinary")

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
    paranoid: true,
    timestamps: true,
  }
);

Attendance.belongsTo(Users, { foreignKey: 'id_user' });

sequelize
  .sync()
  .then(() => {
    console.log("Absence created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create absence:", error);
  });
  

  export const getAttendances = async (req: QuerySchema) => {
  const attendance = await Attendance.findAll({
    where: { deletedAt: null },
    attributes: {
      exclude: ["password", "updatedAt", "deletedAt"],
    },
  });
  return attendance;
};

export const createAttendance = async (req: Request, body: AttendanceCreateSchema) => {
    
  let newBody: AttendanceCreateSchema = {
    ...body,
  };

  if (req.file) {
    const {path} = req.file;

    const uploader = async (path: any) =>
        await cloudinary.uploads(path, "dj9i0bcyg");
    const newPath = await uploader(path);

    newBody.picture = newPath.url;
  }

  const attendance = await Attendance.create(newBody);

  return attendance;
};

export const getAttendanceById = async (id: string) => {
    const attendance = await Attendance.findOne({
      where: { id },
      include: [{ model: Users, attributes: ['full_name'] }],
      attributes: {
        exclude: ["createdAt", "updatedAt"],
      },
    });
    return attendance;
  };

export default Attendance;