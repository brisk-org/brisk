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
  ManyToOne,
} from "typeorm";
import { Medication } from "./Medication";
import { QuickPrescription } from "./QuickPrescription";

@ObjectType()
@Entity()
export class QuickMedicine extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [QuickPrescription])
  @ManyToOne(
    () => QuickPrescription,
    (prescription) => prescription.medicines,
    {
      onDelete: "CASCADE",
    }
  )
  prescription: QuickPrescription;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
