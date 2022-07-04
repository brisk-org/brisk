import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  ManyToOne,
  ManyToMany,
  JoinTable,
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

  @Field(() => [QuickLaboratoryExamination], { nullable: true })
  @ManyToMany(() => QuickLaboratoryExamination, (labTest) => labTest.tests, {
    nullable: true,
    onDelete: "CASCADE",
  })
  examinations?: QuickLaboratoryExamination[];

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
