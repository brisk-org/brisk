import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  BaseEntity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { History } from "./History";
import { CardSales } from "./CardSales";
import { Notification } from "./Notification";

@ObjectType()
@Entity()
export class Consultaion extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => [Notification], { nullable: true })
  @OneToMany(() => Notification, (notification) => notification.card, {
    onDelete: "CASCADE",
    nullable: true,
  })
  notifications?: Notification[];

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  phone: string;

  @Field()
  @Column({ type: "smallint" })
  age: string;

  @Field()
  @Column({ default: true })
  new: boolean;

  @Field()
  @Column({ default: true })
  valid: boolean;

  @Field()
  @Column({ default: 1 })
  visited_count: number;

  @Field()
  @Column()
  gender: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  address?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  k_ketema?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  kebele?: string;

  @Field(() => String, { nullable: true })
  @Column({ nullable: true })
  house_no?: string;

  @Field(() => [CardSales], { nullable: true })
  @OneToMany(() => CardSales, (payment) => payment.card, { nullable: true })
  payment?: CardSales[];

  @Field(() => [History], { nullable: true })
  @OneToMany(() => History, (history) => history.card, { nullable: true })
  history?: History[];

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
