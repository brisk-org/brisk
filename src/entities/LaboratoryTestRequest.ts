import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
} from "typeorm";

@ObjectType()
@Entity()
export class LaboratoryTestRequest extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  // @Field()
  // @Column("laboratoryTestId")
  // laboratoryTestId: string;

  // @Field(() => LaboratoryTest)
  // @ManyToOne(
  //   () => LaboratoryTest,
  //   (laboratoryTest) => laboratoryTest.laboratoryTestRequests,
  //   { onDelete: "CASCADE" }
  // )
  // laboratoryTest: LaboratoryTest;

  // @Field(() => LaboratoryExamination)
  // @ManyToOne(
  //   () => LaboratoryExamination,
  //   (laboratoryTest) => laboratoryTest.laboratoryTestRequests
  // )
  // laboratoryExamination: LaboratoryExamination;

  @Field({ nullable: true })
  @Column({ nullable: true })
  value?: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
