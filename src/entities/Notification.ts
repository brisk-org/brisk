import { NotificationAction, Occupation } from "../utils/EnumTypes";
import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
  ManyToOne,
} from "typeorm";
import { Prescription } from "./Prescription";
import { LaboratoryExamination } from "./LaboratoryExamination";
import { QuickPrescriptionTest } from "./QuickPrescriptionTest";
import { QuickLaboratoryTest } from "./QuickLaboratoryTest";
import { Card } from "./Card";

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: string;

  @Field(() => [Occupation])
  @Column("varchar", { array: true })
  for: Occupation[];

  @Field()
  @Column()
  message: string;

  @Field(() => NotificationAction)
  @Column()
  action: NotificationAction;

  @Field(() => Card, { nullable: true })
  @ManyToOne(() => Card, (card) => card.notifications, {
    nullable: true,
  })
  card?: Card;

  @Field(() => LaboratoryExamination, { nullable: true })
  @ManyToOne(
    () => LaboratoryExamination,
    (laboratoryTest) => laboratoryTest.notifications,
    {
      nullable: true,
    }
  )
  laboratory_test?: LaboratoryExamination;

  @Field(() => Prescription, { nullable: true })
  @ManyToOne(() => Prescription, (prescription) => prescription.notifications, {
    onDelete: "CASCADE",
    nullable: true,
  })
  prescription?: Prescription;

  @Field(() => QuickPrescriptionTest, { nullable: true })
  @ManyToOne(
    () => QuickPrescriptionTest,
    (quickPrescription) => quickPrescription.notifications,
    {
      nullable: true,
    }
  )
  quick_prescription_test?: QuickPrescriptionTest;

  @Field(() => QuickLaboratoryTest, { nullable: true })
  @ManyToOne(
    () => QuickLaboratoryTest,
    (quickLaboratoryTest) => quickLaboratoryTest.notifications,
    {
      nullable: true,
    }
  )
  quick_laboratory_test?: QuickLaboratoryTest;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;
}
