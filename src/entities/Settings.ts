import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class Settings extends BaseEntity {
  @Field(() => ID!)
  @PrimaryColumn()
  id!: number;

  @Field()
  @Column({ default: 100 })
  card_price: number;

  @Field()
  @Column({ type: "json" })
  laboratory_tests_data: string;

  @Field()
  @Column({ type: "json" })
  prescription_tests_data: string;

  @Field()
  @Column({ default: 30 })
  card_expiration_date: number;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
