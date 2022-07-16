import { Connection } from "typeorm";
import { Card } from "../../entities/Card";
import { LaboratoryExamination } from "../../entities/LaboratoryExamination";
import { LaboratoryTest } from "../../entities/LaboratoryTest";
import { LaboratoryTestCategory } from "../../entities/LaboratoryTestCategory";
import { LaboratoryTestSubCategory } from "../../entities/LaboratoryTestSubCategory";

const categries = [
  "Hematology",
  "Serology",
  "STOOL TEST",
  "Urinalysis",
  "Microscopy",
  "Hormone Test",
  "Bacteriology",
  "Clinical Chemistry",
];
export default async (connection: Connection) => {
  await LaboratoryTestCategory.delete({});
  await LaboratoryTest.delete({});
  const setting = await connection.query(
    'select * from "settings" where "id" = 1'
  );
  let err = 0;

  for (let i = 0; i < categries.length; i++) {
    await LaboratoryTestCategory.create({
      name: categries[i],
      inStock: 0,
      trackInStock: false,
      price: 0,
    }).save();
  }

  for (
    let i = 0;
    i < JSON.parse(setting[0].laboratory_tests_data).length;
    i++
  ) {
    const parsedData = JSON.parse(setting[0].laboratory_tests_data)[i];
    console.log(
      parsedData,
      "heree",
      i,
      setting[0].laboratory_tests_data.length
    );
    const category = await LaboratoryTestCategory.findOne({
      where: { name: parsedData.category },
    });
    if (!category) {
      throw new Error(`NO category yaaaosdofksldj ${parsedData.category}`);
    }
    console.log(category, parsedData);
    await LaboratoryTest.create({
      category,
      name: parsedData.name,
      price: parsedData.price,
      hasPrice: !!parsedData.price,
      normalValue: parsedData.normalValue || "",
    }).save();
  }
  console.log(
    await (
      await LaboratoryTest.find()
    ).length,
    JSON.parse(setting[0].laboratory_tests_data).length
  );
};
