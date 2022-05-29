import { User } from "../../../entities/User";
import { Field, ObjectType, ArgsType } from "type-graphql";
import { Occupation } from "../../../utils/EnumTypes";

@ObjectType()
export class FieldError {
  @Field(() => String, { nullable: true })
  field: string;
  @Field(() => String, { nullable: true })
  message: string;
}
@ObjectType()
export class UserResponse {
  @Field(() => [FieldError], { nullable: true })
  errors?: FieldError[];
  @Field(() => User, { nullable: true })
  user?: User;
  @Field({ nullable: true })
  token?: string;
}

@ArgsType()
export class LoginUserInputFields {
  @Field()
  username: string;
  @Field()
  password: string;
}
@ArgsType()
export class UserRegisterArgs {
  @Field()
  username: string;

  @Field()
  password: string;

  @Field(() => Occupation)
  occupation: string;
}
