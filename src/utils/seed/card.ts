import { Connection } from "typeorm";
import { Card } from "../../entities/Card";

export default async (connection: Connection) => {
  const a = await connection.query('select * from "card"');
  let err = 0;
  console.log(a);
  for (let i = 0; i < a.length; i++) {
    try {
      // const c = await Card.insert({ ...editedCard, id: a[i].id });
      // console.log(a);
      await Card.query(`INSERT INTO "card"(id , name ,  phone ,  age ,  new ,  valid ,  visited_count ,  gender ,  address , k_ketema ,  kebele ,  house_no ,  created_at ,  updated_at )
            VALUES(
      ${a[i].id}, '${a[i].name}', '${a[i].phone}', ${a[i].age}, ${a[i].new}, ${
        a[i].valid
      }, ${a[i].visited_count}, '${a[i].gender}', '${a[i].address}', '${[
        a[i].k_ketema,
      ]}', '${[a[i].kebele]}', '${a[i].house_no}', '${new Date(
        a[i].created_at
      ).toISOString()}', '${new Date(a[i].updated_at).toISOString()}'
                    )
            `);
      console.log(a.length, i);
    } catch (error) {
      err++;
      console.log(error);
    }
  }
  const maxId = await connection.query('SELECT MAX("id") FROM "card"');
  console.log(maxId, maxId[0].max);
  await connection.query(
    `SELECT pg_catalog.setval('public.card_id_seq', ${maxId[0].max}, true)`
  );
  console.log((await Card.find()).length, a.length, "yasdkfjsd", err);
};
`


`;
