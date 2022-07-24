import { create } from "domain";
import { Connection } from "typeorm";
import { Card } from "../../entities/Card";
import { LaboratoryExamination } from "../../entities/LaboratoryExamination";
import { LaboratoryTest } from "../../entities/LaboratoryTest";

export default async (connection: Connection) => {
  let failed = 0;
  await LaboratoryExamination.update({}, { values: [] });
  const examination = await connection.query('select * from "laboratory_test"');
  for (let i = 0; i < examination.length; i++) {
    const { result, created_at, updated_at } = examination[i];
    const laboratoryExamination = await LaboratoryExamination.findOne({
      where: { created_at },
    });
    const labName = JSON.parse(result) as any[];

    if (!laboratoryExamination) {
      //   throw new Error(`NO laboratoryExamination for (${laboratoryExamination})`);
      failed++;
      console.log(
        laboratoryExamination,
        result,
        examination[i],
        "lksdjflaksdjfl;kasdjf;lksdjf;lasjdf;laskjdf;lksjd;flksjdf;"
      );
    }
    for (let j = 0; j < labName.length; j++) {
      const laboratoryTest = await LaboratoryTest.findOne({
        where: {
          name:
            labName[j].name === "Differential(L)"
              ? "Differential(L%)"
              : labName[j].name,
        },
      });
      laboratoryExamination?.values?.unshift({
        id: laboratoryTest?.id + "",
        value: labName[j].value || "",
      });
      (laboratoryExamination as any).updated_at = updated_at;
      await laboratoryExamination?.save();
      await LaboratoryExamination.query(
        `UPDATE laboratory_examination set updated_at='${new Date(
          updated_at
        ).toISOString()}' WHERE id='${laboratoryExamination?.id}'`
      );
    }
    console.log(laboratoryExamination?.values, updated_at);

    console.log(
      new Date(laboratoryExamination?.updated_at as any) == new Date(updated_at)
    );
    console.log(
      ".................................................................",
      labName.length
    );
    console.log(i, examination.length, failed);
  }
};
