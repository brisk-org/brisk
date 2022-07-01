import { Connection } from "typeorm";
import { LaboratoryExamination } from "../../entities/LaboratoryExamination";
import { LaboratoryTest } from "../../entities/LaboratoryTest";
import { Medication } from "../../entities/Medication";
import { Medicine } from "../../entities/Medicine";
import { Prescription } from "../../entities/Prescription";

export default async (connection: Connection) => {
  const examination = await connection.query(
    'select * from "prescription_test"'
  );
  await Prescription.delete({});
  await Medication.clear();
  for (let i = 0; i < examination.length; i++) {
    const {
      cardId,
      completed,
      paid,
      price,
      new: isNew,
      result,
      other,
    } = examination[i];
    const parsedResult = JSON.parse(result);
    console.log(parsedResult);

    const prescription = Prescription.create({
      cardId,
      completed,
      paid,
      price,
      new: isNew,
      rx: other || "",
      medications: [],
    });
    for (let i = 0; i < parsedResult.length; i++) {
      const { name, perDay, quantity: strength, forDays } = parsedResult[i];
      const medicine = await Medicine.findOne({
        where: { name },
      });

      const medication = await Medication.create({
        checkIn: [
          {
            date: "",
            price: 0,
            status: [{ isCompleted: false, isPaid: false }],
          },
        ],
        medicine,
        strength,
        //found 1.5 here
        forDays: parseInt(forDays),
        perDay: ((perDay as string) === "bib" ? "bid" : perDay).toUpperCase(),
      }).save();
      prescription.medications.push(medication);
    }
    await prescription.save();
    console.log((await Prescription.find()).length, examination.length);
  }
};
