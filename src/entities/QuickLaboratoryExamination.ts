import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { QuickLaboratoryExaminationResult } from "../utils/EnumTypes";
import { Notification } from "./Notification";
import { QuickLaboratoryTest } from "./QuickLaboratoryTest";

@ObjectType()
@Entity()
export class QuickLaboratoryExamination extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => [Notification], { nullable: true })
  @OneToMany(
    () => Notification,
    (notification) => notification.quick_laboratory_test,
    {
      onDelete: "CASCADE",
      nullable: true,
    }
  )
  notifications?: Notification[];

  @Field()
  @Column({ default: 0 })
  price: number;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field()
  @Column({ default: true })
  new: boolean;

  @Field()
  @Column({ default: false })
  paid: boolean;

  @Field(() => [QuickLaboratoryTest])
  @ManyToMany(() => QuickLaboratoryTest, (labTest) => labTest.examinations)
  @JoinTable()
  tests: QuickLaboratoryTest[];

  @Field(() => QuickLaboratoryExaminationResult, { nullable: true })
  @Column({ nullable: true })
  result?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  other?: string;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
