import { User } from "../../entities/User";
import { Arg, Args, Ctx, ID, Mutation, Query, Resolver } from "type-graphql";
import {
  LoginUserInputFields,
  UserRegisterArgs,
  UserResponse,
} from "./InputType";
import Context from "../../constants/Context";
import bcrypt from "bcrypt";
import { createTokens } from "../../utils/createTokens";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  async allUsers(): Promise<User[] | undefined> {
    return await User.find();
  }

  @Query(() => User, { nullable: true })
  async me(@Ctx() { req }: Context): Promise<User | null> {
    const user = await User.findOne(req.user.id);
    if (!user) {
      return null;
    }
    return user;
  }

  @Mutation(() => UserResponse)
  async register(
    @Args() { username, occupation, password }: UserRegisterArgs,
    @Ctx() { res }: Context,
  ): Promise<UserResponse> {
    const userExists = await User.findOne({ where: { username } });
    if (userExists) {
      return {
        errors: [
          {
            field: "username",
            message: "Username is already taken",
          },
        ],
      };
    }
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        username,
        password: hashedPassword,
        occupation,
      }).save();

      const { accessToken, refreshToken } = createTokens(user);

      res.cookie("jwt-refresh", refreshToken, { httpOnly: true });
      res.cookie("jwt-access", accessToken, { httpOnly: false });

      return {
        user,
        token: accessToken,
      };
    } catch (err) {
      return {
        errors: [{ field: "System Error", message: err }],
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Args() { username, password }: LoginUserInputFields,
    @Ctx() { res }: Context,
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return {
        errors: [
          {
            field: "name",
            message: `Sorry We couldn't Find any Records matching ${username} Please try again.`,
          },
        ],
      };
    }
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return {
        errors: [
          {
            field: "password",
            message: `Invalid Password.`,
          },
        ],
      };
    }
    const { refreshToken, accessToken } = createTokens(user);

    res.cookie("jwt-refresh", refreshToken, { httpOnly: true });
    res.cookie("jwt-access", accessToken, { httpOnly: false });

    return {
      user,
      token: accessToken,
    };
  }
  @Mutation(() => UserResponse)
  async changeUserDetail(
    @Args() { username, password }: LoginUserInputFields,
    @Arg("newName", { nullable: true }) newName: string,
    @Ctx() { req, res }: Context,
  ): Promise<UserResponse> {
    const user = await User.findOne({ where: { username } });
    const exist =
      newName && (await User.findOne({ where: { username: newName } }));

    if (!user) {
      return {
        errors: [
          {
            field: "username",
            message: "Specified Username Doesn't Exists",
          },
        ],
      };
    }
    if (exist) {
      return {
        errors: [
          {
            field: "username",
            message: "Username Exists",
          },
        ],
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(user.password);
    try {
      await User.update(
        { username },
        { username: newName || username, password: hashedPassword },
      );
      await user.reload();
      console.log(user.password);
      const { accessToken, refreshToken } = createTokens(user);
      (req as any).userId = user.id;
      res.cookie("jwt-refresh", refreshToken);
      res.cookie("jwt-access", accessToken);

      return {
        user,
        token: accessToken,
      };
    } catch (err) {
      return {
        errors: [
          {
            field: "unknown",
            message: err,
          },
        ],
      };
    }
  }
  // @Mutation(() => User)
  // async changeWorkHours(
  //   @Arg("workHours", () => [ChangeWorkHours]) workHours: ChangeWorkHours[],
  //   @Arg("id", () => ID) id: number
  // ): Promise<User | null> {
  //   const user = await User.findOne(id);
  //   if (!user || workHours) return null;
  //   await User.update(id, {
  //     // work_hours: JSON.stringify(workHours),
  //   });
  //   await user.reload();
  //   return user;
  // }
  @Mutation(() => User)
  async uploadPhoto(
    @Arg("id", () => ID) id: string,
  ): Promise<User | undefined> {
    const user = await User.findOne(id);
    return user;
  }
  @Mutation(() => Number)
  async deleteUser(
    @Arg("id", () => ID) id: string,
  ): Promise<number | undefined | null> {
    return (await User.delete(id)).affected;
  }
}
