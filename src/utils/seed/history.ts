import { Connection } from "typeorm";
import { History } from "../../entities/History";

export default async (connection: Connection) => {
  const a = await connection.query('select * from "history"');
  await History.delete({});
  for (let i = 0; i < a.length; i++) {
    try {
      await History.insert(a[i]);
      console.log(a.length, i);
    } catch (err) {
      console.log(err);
    }
  }

  console.log((await History.find()).length, a.length, "yasdkfjsd");
};
