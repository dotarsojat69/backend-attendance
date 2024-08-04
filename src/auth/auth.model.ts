import jsonwebtoken from "jsonwebtoken";

import Users from "../users/users.model";

export const loginUser = async (data: any, email: string) => {
  const token = jsonwebtoken.sign(
    { user_id: data.id, email, role: data.role },
    process.env.TOKEN_KEY as string,
    {
      expiresIn: "2h",
    }
  );

  return token;
};

export const getUserByEmail = async (email: string, paranoid: boolean) => {
  const user = await Users.findOne({ where: { email }, paranoid: paranoid });

  return user;
};