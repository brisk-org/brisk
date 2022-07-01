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
import { QuickMedicine } from "./QuickMedicine";

@ObjectType()
@Entity()
export class QuickPrescription extends BaseEntity {
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

  @Field(() => [QuickMedicine])
  @OneToMany(() => QuickMedicine, (medicine) => medicine.prescription, {
    onDelete: "CASCADE",
  })
  medicines: QuickMedicine[];

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
