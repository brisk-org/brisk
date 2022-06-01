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
import { LaboratoryTest } from "./LaboratoryTest";
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

  @Field(() => LaboratoryTest, { nullable: true })
  @ManyToOne(
    () => LaboratoryTest,
    (laboratoryTest) => laboratoryTest.notifications,
    {
      nullable: true,
    }
  )
  laboratory_test?: LaboratoryTest;

  @Field(() => Prescription, { nullable: true })
  @ManyToOne(() => Prescription, (prescription) => prescription.notifications, {
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
