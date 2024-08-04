import { DataTypes } from "sequelize";
import { Request } from "express";
import bcrypt from "bcryptjs";

import sequelize from "../utils/configs/database";
import { UserUpdateSchema } from "./users.types";
import { RegistSchema } from "../users/users.types";

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
        "https://res.cloudinary.com/dj9i0bcyg/image/upload/v1722767567/pp_hyticn.png",
    },
    position: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    working_hour: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
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

  export const regisUser = async (body: RegistSchema) => {
    const { email, password } = body;
  
    const encryptedPassword = await bcrypt.hash(password, 10);
  
    const object = {
      ...body,
      email: email.toLowerCase(),
      password: encryptedPassword,
    };
  
    const user = await Users.create(object);
  
    return user;
  };

export const getUserByIdToken = async (req: Request) => {
  const { user_id } = req.token;
  const user = await Users.findAll({
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
      await cloudinary.uploads(path, "dj9i0bcyg");
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

export const getUserById = async (id: string) => {
  const user = await Users.findOne({
    where: { id, deletedAt: null },
    attributes: ['id', 'nik', 'full_name', 'email', 'role', 'profile_picture', 'position', 'working_hour'],
  });

  return user;
};

export const getUserByEmail = async (email: string, paranoid: boolean) => {
  const user = await Users.findOne({ where: { email }, paranoid: paranoid });

  return user;
};

export default Users;