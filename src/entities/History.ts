import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class History extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("cardId")
  cardId: number;

  @Field(() => Card)
  @ManyToOne(() => Card, (card) => card.history, { onDelete: "CASCADE" })
  card: Card;

  @Field()
  @Column({ type: "json" })
  result: string;

  @Field(() => [String], { nullable: true })
  @Column({ type: "simple-array", nullable: true })
  file_path?: string[];

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
