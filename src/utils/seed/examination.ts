import { Connection } from "typeorm";
import { LaboratoryExamination } from "../../entities/LaboratoryExamination";
import { LaboratoryTest } from "../../entities/LaboratoryTest";

export default async (connection: Connection) => {
  // await LaboratoryExamination.delete({});
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

    const laboratoryExamination = await LaboratoryExamination.create({
      cardId,
      completed,
      paid,
      price,
      new: isNew,
      laboratoryTests: [],
      created_at,
      updated_at,
    });

    for (let j = 0; j < labName.length; j++) {
      const laboratoryTest = await LaboratoryTest.findOne({
        where: {
          name:
            labName[j] === "Differential(L)" ? "Differential(L%)" : labName[j],
        },
      });
      if (!laboratoryTest) {
        throw new Error(`No labTest names ${labName[j]}`);
      }
      laboratoryTest &&
        laboratoryExamination.laboratoryTests.unshift(laboratoryTest);
      laboratoryTest?.laboratoryTestExaminations?.unshift(
        laboratoryExamination
      );
      await laboratoryExamination.save();
      await laboratoryTest?.save();
    }

    console.log(
      laboratoryExamination.laboratoryTests.length === labName.length
        ? "................................................................."
        : false,
      labName.length
    );
    console.log(
      (await LaboratoryExamination.find()).length,
      examination.length
    );
  }
};
