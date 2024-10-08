import { Connection } from "typeorm";
import { Card } from "../../entities/Card";
import { CardSales } from "../../entities/CardSales";

export default async (connection: Connection) => {
  const cardSales: any[] = await connection.query('select * from "card_sales"');
  let err = 0;
  await CardSales.clear();
  for (let i = 0; i < cardSales.length; i++) {
    try {
      // const c = await Card.insert({ ...editedCard, id: a[i].id });
      // console.log(a);
      const card = await Card.findOne(cardSales[i].cardId);
      await CardSales.insert({ card, ...cardSales[i] });
    } catch (err) {
      err++;
      console.log(err);
      return;
    }
  }

  console.log(
    (await CardSales.find()).length,
    cardSales.length,
    "yasdkfjsd",
    err
  );
};
