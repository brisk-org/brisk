import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
} from "typeorm";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class LaboratoryTest extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column("cardId")
  cardId!: number;

  @Field(() => Card)
  @ManyToOne(() => Card, (card) => card.laboratory_tests, {
    onDelete: "CASCADE",
  })
  card!: Card;

  @Field()
  @Column({ type: "json" })
  result!: string;

  @Field()
  @Column({ default: false })
  paid!: boolean;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column({ default: false })
  completed!: boolean;

  @Field()
  @Column({ default: true })
  new!: boolean;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
