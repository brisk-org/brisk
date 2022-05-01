import { User } from "../entities/User";
import jwt from "jsonwebtoken";

export const createTokens = ({ id, username, occupation }: User) => {
  const refreshToken = jwt.sign({ id }, process.env.REFRESH_TOKEN_SECRET!, {
    expiresIn: "7d",
  });
  const accessToken = jwt.sign(
    { id, username, occupation },
    process.env.ACCESS_TOKEN_SECRET!,
    { expiresIn: "7d" }
  );

  return { refreshToken, accessToken };
};
