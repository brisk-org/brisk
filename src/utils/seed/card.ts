import { Connection } from "typeorm";
import { Card } from "../../entities/Card";

export default async (connection: Connection) => {
  const a = await connection.query('select * from "card"');
  let err = 0;
  for (let i = 0; i < a.length; i++) {
    const editedCard: Card = {
      ...a[i],
      k_ketema: !a[i].k_ketema ? null : a[i].k_ketema,
      address: !a[i].address ? null : a[i].address,
      kebele: !a[i].kebele ? null : a[i].kebele,
      house_no: a[i].house_no === "0000" ? null : a[i].house_no,
    };
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
    } catch (err) {
      err++;
      console.log(err);
      return;
    }
  }

  console.log((await Card.find()).length, a.length, "yasdkfjsd", err);
};
`


`;
