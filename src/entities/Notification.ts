import { Field, ID, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  Entity,
} from "typeorm";

type NotifAction =
  | "PAY_FOR_LABORATORY_TEST"
  | "PAY_FOR_PRESCRIPTION"
  | "PAY_FOR_QUICK_LABORATORY_TEST"
  | "PAY_FOR_QUICK_PRESCRIPTION"
  | "CREATE_LABORATORY_TEST"
  | "CREATE_PRESCRIPTION"
  | "CREATE_CARD"
  | "PRODUCT_CARD"
  | "CREATE_QUICK_LABORATORY_TEST"
  | "CREATE_QUICK_PRESCRIPTION_TEST"
  | "MARK_CARD_AS_NEW"
  | "COMPLETE_LABORATORY_TEST"
  | "COMPLETE_QUICK_LABORATORY_TEST"
  | "COMPLETE_QUICK_PRESCRIPTION_TEST"
  | "COMPLETE_PRESCRIPTION";

@ObjectType()
@Entity()
export class Notification extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  desc: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  card_id?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  laboratory_test_id?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  prescription_id?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  quick_prescription_test_id?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  quick_laboratory_test_id?: number;

  @Field()
  @Column()
  action: NotifAction;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;
}
