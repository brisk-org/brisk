import { createConnection } from "typeorm";
import { Card } from "../../entities/Card";
import card from "./card";
import cardSales from "./cardSales";
import examination from "./examination";
import history from "./history";
import lab from "./lab";
import medication from "./medication";
import medicine from "./medicine";
import qucickTest from "./qucickTest";

export default async () => {
  // const c = await createConnection({
  //   name: "newLife",
  //   url: "postgresql://postgres:kranuaonpostgres@localhost:5433/newlife-brisk",
  //   type: "postgres",
  // });
  // await card(c);
  // await history(c);
  // await lab(c);
  // await examination(c);
  // await medicine(c);
  // await medication(c);
  // await cardSales(c);
  // await qucickTest(c);
};
