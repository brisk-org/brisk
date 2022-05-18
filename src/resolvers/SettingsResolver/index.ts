import { Arg, Mutation, Query, Resolver } from "type-graphql";
import { ChangeSettingsInput } from "./InputType";
import { Settings } from "../../entities/Settings";

@Resolver()
export class SettingsResolver {
  @Query(() => Settings)
  setting() {
    return Settings.findOne(1);
  }
  @Mutation(() => Settings)
  async changeSetting(
    @Arg("setting", () => ChangeSettingsInput) setting: ChangeSettingsInput
  ) {
    try {
      const exists = await Settings.findOne(1);
      if (!exists) {
        const rate = await Settings.create({
          id: 1,
          ...setting,
          laboratory_tests_data: setting.laboratory_tests_data,
          prescription_tests_data: setting.prescription_tests_data,
        }).save();
        return rate;
      }
      Settings.update(1, {
        ...setting,
        laboratory_tests_data: setting.laboratory_tests_data,
        prescription_tests_data: JSON.stringify(
          setting.prescription_tests_data
        ),
      });

      await exists.reload();
      return exists;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
