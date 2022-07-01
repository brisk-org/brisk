import { Connection } from "typeorm";
import { LaboratoryExamination } from "../../entities/LaboratoryExamination";
import { LaboratoryTest } from "../../entities/LaboratoryTest";

export default async (connection: Connection) => {
  const examination = await connection.query('select * from "laboratory_test"');
  for (let i = 0; i < examination.length; i++) {
    const {
      cardId,
      completed,
      paid,
      price,
      new: isNew,
      result,
      created_at,
      updated_at,
    } = examination[i];
    const labName = (JSON.parse(result) as any[]).map((result) => result.name);
    console.log(labName, "labNmae");
    const laboratoryTests = await LaboratoryTest.find({
      where: { name: labName },
    });

    await LaboratoryExamination.create({
      cardId,
      completed,
      paid,
      price,
      new: isNew,
      laboratoryTests,
      created_at,
      updated_at,
    }).save();
    console.log(
      (await LaboratoryExamination.find()).length,
      examination.length
    );
  }
};
