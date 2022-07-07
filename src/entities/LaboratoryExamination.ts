import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  BaseEntity,
  OneToMany,
  ManyToMany,
  JoinTable,
} from "typeorm";
import { Card } from "./Card";
import { LaboratoryTest } from "./LaboratoryTest";
import { Notification } from "./Notification";

@ObjectType()
class LaboratoryExaminationValue {
  @Field(() => ID)
  id: string;
  @Field()
  value: string;
}
@ObjectType()
@Entity()
export class LaboratoryExamination extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column("cardId")
  cardId!: number;

  @Field(() => Card)
  @ManyToOne(() => Card, (card) => card.laboratoryExaminations, {
    onDelete: "CASCADE",
  })
  card!: Card;

  @Field(() => [Notification], { nullable: true })
  @OneToMany(
    () => Notification,
    (notification) => notification.laboratory_test,
    {
      onDelete: "CASCADE",
      nullable: true,
    }
  )
  notifications?: Notification[];

  @Field(() => [LaboratoryTest])
  @ManyToMany(
    () => LaboratoryTest,
    (laboraotryTest) => laboraotryTest.laboratoryTestExaminations,
    {
      onDelete: "CASCADE",
    }
  )
  @JoinTable()
  laboratoryTests: LaboratoryTest[];

  @Field(() => [LaboratoryExaminationValue], { nullable: true })
  @Column({ type: "json", nullable: true })
  values?: LaboratoryExaminationValue[];

  @Field()
  @Column({ default: false })
  paid!: boolean;

  @Field()
  @Column()
  price!: number;

  @Field()
  @Column({ default: false })
  completed!: boolean;

  @Field()
  @Column({ default: true })
  new!: boolean;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
