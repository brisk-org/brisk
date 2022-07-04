import { Connection } from "typeorm";
import { QuickLaboratoryExamination } from "../../entities/QuickLaboratoryExamination";
import { QuickLaboratoryTest } from "../../entities/QuickLaboratoryTest";
import { QuickMedicine } from "../../entities/QuickMedicine";
import { QuickPrescription } from "../../entities/QuickPrescription";

export default async (connection: Connection) => {
  const lab: any[] = await connection.query(
    'select * from "quick_laboratory_test"'
  );
  const presc: any[] = await connection.query(
    'select * from "quick_prescription_test"'
  );
  const labTests = ["fbs", "hcg", "rbs"];
  const prescTests = ["bp", "dressing", "injection", "tat", "depo"];
  let err = 0;
  await QuickLaboratoryExamination.delete({});
  await QuickPrescription.delete({});
  await QuickLaboratoryTest.delete({});
  await QuickMedicine.delete({});
  for (let i = 0; i < labTests.length; i++) {
    await QuickLaboratoryTest.create({ name: labTests[i] }).save();
  }
  for (let i = 0; i < prescTests.length; i++) {
    await QuickMedicine.create({ name: prescTests[i] }).save();
  }
  for (let i = 0; i < lab.length; i++) {
    const testsName = Object.entries(JSON.parse(lab[i].result))
      .map(([key, value]) => value === true && key)
      .filter((key) => key);
    console.log(testsName, lab[i].result, lab[i].name, "hereeeee");
    const exam = QuickLaboratoryExamination.create({
      completed: lab[i].completed,
      name: lab[i].name,
      new: lab[i].new,
      price: lab[i].price,
      paid: lab[i].paid,
      other: lab[i].other,
      tests: [],
      created_at: lab[i].created_at,
      updated_at: lab[i].updated_at,
    });
    for (let j = 0; j < testsName.length; j++) {
      const test = await QuickLaboratoryTest.findOne({
        where: { name: testsName[j] },
      });
      console.log(test, testsName[j]);
      if (!test) {
        console.log("lasdjflsdkfjs;ldkjf;asldkfj");
        throw new Error(`No test named ${test}`);
      }
      exam.tests.push(test);
      console.log(exam);
      await exam.save();
      test.examinations?.push(exam);
      await test.save();
    }
  }
  //   for (let i = 0; i < presc.length; i++) {
  //     try {
  //       const prescriptionName = Object.keys(JSON.parse(presc[i].result));
  //       let medicines: QuickMedicine[] = [];
  //       for (let j = 0; j < prescriptionName.length; j++) {
  //         const medicine = await QuickMedicine.findOne({
  //           where: { name: prescriptionName[j] },
  //         });
  //         if (!medicine) {
  //           throw new Error(`No medicine named ${medicine}`);
  //         }
  //         medicines.push(medicine);
  //       }
  //       await QuickPrescription.create({
  //         completed: presc[i].completed,
  //         name: presc[i].name,
  //         new: presc[i].new,
  //         price: presc[i].price,
  //         paid: presc[i].paid,
  //         other: presc[i].other,
  //         created_at: presc[i].created_at,
  //         updated_at: presc[i].updated_at,
  //         medicines,
  //       }).save();
  //     } catch (err) {
  //       err++;
  //       console.log(err);
  //       return;
  //     }
  //   }

  //   console.log(
  //     (await QuickLaboratoryExamination.find()).length,
  //     lab.length,
  //     "yasdkfjsd",
  //     err
  //   );
  //   console.log(
  //     await QuickPrescription.count(),
  //     await QuickMedicine.count(),
  //     presc.length,
  //     "yasdkfjsd",
  //     err
  //   );
};
