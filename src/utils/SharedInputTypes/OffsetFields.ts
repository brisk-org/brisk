import { ArgsType, Field } from "type-graphql";

@ArgsType()
export class SearchAndOffsetFields {
  @Field(() => String)
  term: string;
  @Field()
  skip: number;
  @Field()
  take: number;
}

@ArgsType()
export class OffsetFields {
  @Field()
  skip: number;
  @Field()
  take: number;
}
@ArgsType()
export class OffsetFieldsWithTime {
  @Field()
  skip: number;
  @Field()
  take: number;
  @Field({ nullable: true })
  from?: string;
  @Field({ nullable: true })
  to?: string;
}
