import { PerDay } from "../utils/EnumTypes";
import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { Medication } from "./Medication";

@ObjectType()
@Entity()
export class Medicine extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => Medication)
  @OneToMany(() => Medication, (prescription) => prescription.medicine, {
    onDelete: "CASCADE",
  })
  prescription: Medication;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column()
  inStock: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  strength?: string;

  @Field(() => PerDay, { nullable: true })
  @Column({ nullable: true })
  perDay?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  forDays?: number;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
