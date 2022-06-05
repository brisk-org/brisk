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
} from "typeorm";
import { Card } from "./Card";
import { LaboratoryTestRequest } from "./LaboratoryTestRequest";
import { Notification } from "./Notification";

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
  @ManyToOne(() => Card, (card) => card.laboratory_tests, {
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

  @Field(() => [LaboratoryTestRequest])
  @OneToMany(
    () => LaboratoryTestRequest,
    (laboraotryTestRequest) => laboraotryTestRequest.laboratoryExamination,
    {
      onDelete: "CASCADE",
      nullable: true,
    }
  )
  laboratoryTestRequests?: LaboratoryTestRequest[];

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
