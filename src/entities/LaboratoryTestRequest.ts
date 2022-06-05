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
import { LaboratoryExamination } from "./LaboratoryExamination";
import { LaboratoryTest } from "./LaboratoryTest";

@ObjectType()
@Entity()
export class LaboratoryTestRequest extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("laboratoryTestId")
  laboratoryTestId: string;

  @Field(() => LaboratoryTest)
  @ManyToOne(
    () => LaboratoryTest,
    (laboratoryTest) => laboratoryTest.laboratoryTestRequests
  )
  laboratoryTest: LaboratoryTest;

  @Field(() => LaboratoryExamination)
  @ManyToOne(
    () => LaboratoryExamination,
    (laboratoryTest) => laboratoryTest.laboratoryTestRequests
  )
  laboratoryExamination: LaboratoryExamination;

  @Field()
  @Column()
  value: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}