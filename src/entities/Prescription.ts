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
import { Medication } from "./Medication";
import { Notification } from "./Notification";

@ObjectType()
@Entity()
export class Prescription extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column("cardId")
  cardId: number;

  @Field(() => Card)
  @ManyToOne(() => Card, (card) => card.prescriptions, {
    onDelete: "CASCADE",
  })
  card: Card;

  @Field(() => [Medication], { nullable: true })
  @OneToMany(() => Medication, (medication) => medication.prescription, {
    onDelete: "CASCADE",
    nullable: true,
  })
  medications: Medication[];

  @Field(() => [Notification], { nullable: true })
  @OneToMany(() => Notification, (notification) => notification.prescription, {
    nullable: true,
  })
  notifications?: Notification[];

  @Field()
  @Column()
  rx: string;

  @Field()
  @Column({ default: false })
  paid: boolean;

  @Field()
  @Column({ default: false })
  inrolled: boolean;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column({ default: false })
  completed: boolean;

  @Field()
  @Column({ default: true })
  new: boolean;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
