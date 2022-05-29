import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
  OneToOne,
} from "typeorm";
import { Medicine } from "./Medicine";
import { Prescription } from "./Prescription";
import { PerDay } from "../utils/EnumTypes";

@ObjectType("CheckInObjectType")
class CheckIn {
  @Field()
  date: string;
  @Field()
  isPaid: boolean;
  @Field()
  isCompleted: boolean;
}

@ObjectType()
@Entity()
export class Medication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Medicine)
  @ManyToOne(() => Medicine, (medicine) => medicine.prescription, {
    onDelete: "CASCADE",
  })
  medicine!: Medicine;

  @Field(() => Medication)
  @OneToOne(() => Prescription, (prescription) => prescription.medications)
  prescription: Prescription;

  @Field({ nullable: true })
  @Column({ nullable: true })
  strength?: string;

  @Field(() => PerDay)
  @Column()
  perDay: string;

  @Field(() => [CheckIn])
  @Column({ type: "json" })
  checkIn: CheckIn[];

  @Field()
  @Column()
  forDays: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  other?: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
