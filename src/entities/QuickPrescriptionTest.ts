import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  BaseEntity,
  UpdateDateColumn,
  OneToMany,
} from "typeorm";
import { Notification } from "./Notification";

@ObjectType()
@Entity()
export class QuickPrescriptionTest extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name!: string;

  @Field(() => [Notification], { nullable: true })
  @OneToMany(
    () => Notification,
    (notification) => notification.quick_prescription_test,
    {
      onDelete: "CASCADE",
      nullable: true,
    }
  )
  notifications?: Notification[];

  @Field()
  @Column({ default: 0 })
  price!: number;

  @Field()
  @Column({ default: false })
  completed!: boolean;

  @Field()
  @Column({ default: true })
  new!: boolean;

  @Field()
  @Column({ default: false })
  paid!: boolean;

  @Field()
  @Column({ type: "json" })
  result!: string;

  // @Field()
  // @Column({ default: false })
  // bp!: boolean;

  // @Field()
  // @Column({ default: false })
  // dressing!: boolean;

  // @Field()
  // @Column({ default: false })
  // injection!: boolean;

  // @Field()
  // @Column({ default: false })
  // tat!: boolean;

  // @Field()
  // @Column({ default: false })
  // depo!: boolean;

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
