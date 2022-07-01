import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
} from "typeorm";
import { QuickLaboratoryExamination } from "./QuickLaboratoryExamination";

@ObjectType()
@Entity()
export class QuickLaboratoryTest extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => QuickLaboratoryTest, { nullable: true })
  @ManyToOne(() => QuickLaboratoryExamination, (labTest) => labTest.tests, {
    nullable: true,
  })
  examination?: QuickLaboratoryExamination;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
