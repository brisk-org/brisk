import { Connection } from "typeorm";
import { Card } from "../../entities/Card";
import { LaboratoryExamination } from "../../entities/LaboratoryExamination";
import { LaboratoryTest } from "../../entities/LaboratoryTest";
import { LaboratoryTestCategory } from "../../entities/LaboratoryTestCategory";
import { Medicine } from "../../entities/Medicine";

export default async (connection: Connection) => {
  const setting = await connection.query(
    'select * from "settings" where "id" = 1'
  );
  let err = 0;

  for (
    let i = 0;
    i < JSON.parse(setting[0].prescription_tests_data).length;
    i++
  ) {
    const {
      name,
      price,
      forDays,
      quantity: strength,
      perDay,
    } = JSON.parse(setting[0].prescription_tests_data)[i];
    await Medicine.create({
      name,
      price,
      forDays,
      perDay: (perDay as string).toUpperCase(),
      strength,
      inStock: 0,
    }).save();
    console.log(
      await (
        await Medicine.find()
      ).length,
      JSON.parse(setting[0].prescription_tests_data).length
    );
  }
};
