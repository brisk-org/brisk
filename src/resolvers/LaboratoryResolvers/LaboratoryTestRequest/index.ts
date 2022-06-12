import { ObjectType, Resolver, Query } from "type-graphql";
import { LaboratoryTestRequest } from "../../../entities/LaboratoryTestRequest";

@ObjectType()
@Resolver()
export class LaboratoryTestRequestResolver {
  @Query(() => [LaboratoryTestRequest])
  async laboratoryTestRequests() {
    return LaboratoryTestRequest.find({ relations: ["laboratoryExamination"] });
  }
}
