import { DataTypes } from "sequelize";
import { Request } from "express";
import bcrypt from "bcryptjs";

import sequelize from "../utils/configs/database";
import { UserUpdateSchema } from "./users.types";
const cloudinary = require("../utils/configs/cloudinary");

const Users = sequelize.define(
  "users",
  {
    nik: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    full_name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM("user", "admin"),
      allowNull: false,
    },
    profile_picture: {
      type: DataTypes.TEXT,
      defaultValue:
        "https://res.cloudinary.com/hypeotesa/image/upload/v1698932147/kitchen-sink/yacw1yf1a7hdbh4ucx8u.png",
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    working_hour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    paranoid: true,
    timestamps: true,
  }
);

sequelize
  .sync()
  .then(() => {
    console.log("Users table created successfully!");
  })
  .catch((error) => {
    console.error("Unable to create table:", error);
  });

export const getUserByIdToken = async (req: Request) => {
  const { user_id } = req.token;
  const user = await Users.findOne({
    where: { id: user_id, deletedAt: null },
    attributes: {
      exclude: ["password", "createdAt", "updatedAt", "deletedAt"],
    },
  });
  return user;
};

export const updateUserByIdToken = async (
  req: Request,
  body: UserUpdateSchema
) => {
  const { user_id } = req.token;

  const encryptedPassword = await bcrypt.hash(body.password, 10);

  let newBody: UserUpdateSchema = {
    ...body,
    email: body.email.toLowerCase(),
    password: encryptedPassword,
  };

  if (req.file) {
    const { path } = req.file;

    const uploader = async (path: any) =>
      await cloudinary.uploads(path, "kitchen-sink");
    const newPath = await uploader(path);

    newBody.profile_picture = newPath.url;
  }

  const user = await Users.update(newBody, {
    where: {
      id: user_id,
      deletedAt: null,
    },
  });

  return user;
};

export const deleteUserByIdToken = async (req: Request) => {
  const { user_id } = req.token;

  const user = await Users.destroy({
    where: {
      id: user_id,
    },
  });

  return user;
};

export const getUserById = async (id: string, requestingUserRole: string) => {
  // TODO: Implement caching to improve performance
  if (requestingUserRole !== 'user') {
    throw new Error('Unauthorized access');
  }

  const user = await Users.findOne({
    where: { id, deletedAt: null },
    attributes: ['id', 'nik', 'full_name', 'email', 'role', 'profile_picture', 'position', 'working_hour'],
  });

  if (!user) {
    throw new Error('User not found');
  }

  return user;
};

export default Users;