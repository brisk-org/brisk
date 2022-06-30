import { Connection } from "typeorm";
import { QuickLaboratoryTest } from "../../entities/QuickLaboratoryTest";
import { QuickPrescriptionTest } from "../../entities/QuickPrescriptionTest";

export default async (connection: Connection) => {
  const lab: {}[] = await connection.query(
    'select * from "quick_laboratory_test"'
  );
  const presc: {}[] = await connection.query(
    'select * from "quick_prescription_test"'
  );
  let err = 0;
  await QuickLaboratoryTest.delete({});
  await QuickPrescriptionTest.delete({});
  for (let i = 0; i < lab.length; i++) {
    try {
      // const c = await Card.insert({ ...editedCard, id: a[i].id });
      // console.log(a);
      await QuickLaboratoryTest.insert(lab[i]);
    } catch (err) {
      err++;
      console.log(err);
      return;
    }
  }
  for (let i = 0; i < presc.length; i++) {
    try {
      // const c = await Card.insert({ ...editedCard, id: a[i].id });
      // console.log(a);
      await QuickPrescriptionTest.create(presc[i]).save();
    } catch (err) {
      err++;
      console.log(err);
      return;
    }
  }

  console.log(
    (await QuickLaboratoryTest.find()).length,
    lab.length,
    "yasdkfjsd",
    err
  );
  console.log(
    await QuickPrescriptionTest.count(),
    presc.length,
    "yasdkfjsd",
    err
  );
};
