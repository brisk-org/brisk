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
  for (let i = 0; i < labTests.length; i++) {
    await QuickLaboratoryTest.create({ name: labTests[i] }).save();
  }
  for (let i = 0; i < prescTests.length; i++) {
    await QuickMedicine.create({ name: prescTests[i] }).save();
  }
  for (let i = 0; i < lab.length; i++) {
    const testsName = Object.keys(JSON.parse(lab[i].result));
    console.log(testsName, "ksldjflksdj");
    try {
      const tests = await QuickLaboratoryTest.find({
        where: { name: testsName },
      });
      console.log(tests);
      await QuickLaboratoryExamination.insert({
        completed: lab[i].completed,
        name: lab[i].name,
        new: lab[i].new,
        price: lab[i].price,
        paid: lab[i].paid,
        other: lab[i].other,
        created_at: lab[i].created_at,
        updated_at: lab[i].updated_at,
        tests,
      });
    } catch (err) {
      err++;
      console.log(err);
      return;
    }
  }
  for (let i = 0; i < presc.length; i++) {
    try {
      const prescriptionName = Object.keys(JSON.parse(presc[i].result));
      const medicines = await QuickLaboratoryTest.find({
        where: { name: prescriptionName },
      });
      console.log(medicines);
      await QuickPrescription.create({
        completed: presc[i].completed,
        name: presc[i].name,
        new: presc[i].new,
        price: presc[i].price,
        paid: presc[i].paid,
        other: presc[i].other,
        created_at: presc[i].created_at,
        updated_at: presc[i].updated_at,
        medicines,
      }).save();
    } catch (err) {
      err++;
      console.log(err);
      return;
    }
  }

  console.log(
    (await QuickLaboratoryExamination.find()).length,
    lab.length,
    "yasdkfjsd",
    err
  );
  console.log(
    await QuickPrescription.count(),
    await QuickMedicine.count(),
    presc.length,
    "yasdkfjsd",
    err
  );
};
