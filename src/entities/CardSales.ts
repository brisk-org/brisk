import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Card } from "./Card";

@ObjectType()
@Entity()
export class CardSales extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Card)
  @ManyToOne(() => Card, (card) => card.payment, { onDelete: "CASCADE" })
  card!: Card;

  @Field()
  @Column()
  price!: number;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;
}
