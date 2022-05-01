import { AuthChecker } from "type-graphql";
import Context from "../constants/Context";

export const authChecker: AuthChecker<Context> = ({ context }, roles) => {
  if (roles.find((role) => role === context.req.user.occupation)) {
    return true;
  }
  return false; // or false if access is denied
};
