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

@ObjectType()
@Entity()
export class PrescriptionMedication extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Medicine)
  @ManyToOne(() => Medicine, (medicine) => medicine.prescription, {
    onDelete: "CASCADE",
  })
  medicine: Medicine;

  @Field(() => Prescription)
  @OneToOne(
    () => Prescription,
    (prescription) => prescription.prescription_medication
  )
  prescription: Prescription;

  @Field({ nullable: true })
  @Column({ nullable: true })
  strength?: string;

  @Field()
  @Column()
  perDay: string;

  @Field()
  @Column()
  checkIn: string;

  @Field()
  @Column()
  forDays: number;

  @Field({ nullable: true })
  @Column()
  other: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
