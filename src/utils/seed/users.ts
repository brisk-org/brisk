import { Connection } from "typeorm";
import { History } from "../../entities/History";
import { User } from "../../entities/User";
import { hash } from "bcrypt";
import { Occupation } from "../EnumTypes";

export default async (connection: Connection) => {
  // const a = await connection.query('select * from "history"');
  // await History.delete({});
  connection
    .createQueryBuilder()
    .insert()
    .into(User)
    .values([
      {
        username: "admin",
        password: await hash("admin", 10),
        occupation: Occupation.ADMIN,
      },
      {
        username: "d",
        password: await hash("d", 10),
        occupation: Occupation.DOCTOR,
      },
      {
        username: "l",
        password: await hash("l", 10),
        occupation: Occupation.LABORATORY,
      },
      {
        username: "n",
        password: await hash("n", 10),
        occupation: Occupation.NURSE,
      },
      {
        username: "r",
        password: await hash("r", 10),
        occupation: Occupation.RECEPTION,
      },
    ])
    .orIgnore()
    .execute();

  // console.log((await History.find()).length, a.length, "yasdkfjsd");
};
