import { DataTypes, Op, Order, WhereOptions } from "sequelize";
import { Request } from "express";
import sequelize from "../utils/configs/database";
import Users from "../users/users.model";
import { AttendanceCreateSchema } from "./attendance.types";
import { getPagination, getPagingData } from "../utils/formatter/api";
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
    profile_picture: {
      type: DataTypes.TEXT,
      defaultValue: "https://res.cloudinary.com/hypeotesa/image/upload/v1698932147/kitchen-sink/yacw1yf1a7hdbh4ucx8u.png",
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
    let order: Order = [["createdAt", "DESC"]];
    let where: WhereOptions<any> = {};
  
    if (req.query) {
      where = { ...where, id_user: { [Op.iLike]: `%${req.query}%` } };
    }
  
    const { limit, offset } = getPagination(+req.page, +req.limit);
  
    const response = await Attendance.findAndCountAll({
      where,
      order,
      limit,
      offset,
      include: [{ model: Users, attributes: ['full_name'] }],
    });
  
    const result = getPagingData(response, +req.page, limit);
    return result;
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

    newBody.profile_picture = newPath.url;
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