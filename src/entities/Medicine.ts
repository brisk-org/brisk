import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
} from "typeorm";
import { PrescriptionMedication } from "./PrescriptionMedication";

@ObjectType()
@Entity()
export class Medicine extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field(() => PrescriptionMedication)
  @OneToMany(
    () => PrescriptionMedication,
    (prescription) => prescription.medicine,
    {
      onDelete: "CASCADE",
    }
  )
  prescription: PrescriptionMedication;

  @Field()
  @Column()
  price: number;

  @Field()
  @Column()
  inStock: number;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
