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
    @Arg("setting", () => ChangeSettingsInput) settingProp: ChangeSettingsInput
  ) {
    try {
      const setting = await Settings.findOne(1);
      if (!setting) {
        return await Settings.create({
          id: 1,
          ...settingProp,
        }).save();
      }
      await Settings.update(1, {
        ...settingProp,
      });

      await setting.reload();
      return setting;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
}
