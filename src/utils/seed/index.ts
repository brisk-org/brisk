import { createConnection } from "typeorm";
import card from "./card";
import cardSales from "./cardSales";
import examination from "./examination";
import history from "./history";
import lab from "./lab";
import medication from "./medication";
import medicine from "./medicine";
import qucickTest from "./qucickTest";
import test from "./test";
import connection from "../../../ormconfig";
import users from "./users";

(async () => {
  const c = await createConnection(connection);

  console.log(await c.query(`select count(1) from "card"`));
  await test(c);
  await users(c);
  // await history(c);
  // await lab(c);
  // await examination(c);
  // await medicine(c);
  // await medication(c);
  // await cardSales(c);
  // await qucickTest(c);
})();
