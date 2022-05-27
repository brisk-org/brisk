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
import { PrescriptionMedication } from "./PrescriptionMedication";

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
  @ManyToOne(() => Card, (card) => card.prescription_tests, {
    onDelete: "CASCADE",
  })
  card: Card;

  @Field()
  @Column({ type: "json" })
  result: string;

  @Field(() => [PrescriptionMedication])
  @OneToMany(
    () => PrescriptionMedication,
    (prescriptionMedication) => prescriptionMedication.prescription,
    { onDelete: "CASCADE" }
  )
  prescription_medication: PrescriptionMedication[];

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
