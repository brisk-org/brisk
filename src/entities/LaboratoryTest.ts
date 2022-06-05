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
import { LaboratoryTestCategory } from "./LaboratoryTestCategory";
import { LaboratoryTestRequest } from "./LaboratoryTestRequest";

@ObjectType()
@Entity()
export class LaboratoryTest extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  normalValue: string;

  @Field(() => [String])
  @Column({ type: "simple-array", array: true })
  commonValues: string[];

  @Field(() => LaboratoryTest)
  @ManyToOne(
    () => LaboratoryTestCategory,
    (laboratoryTestCategory) => laboratoryTestCategory.laboratoryTests
  )
  category: LaboratoryTestCategory;

  @Field(() => LaboratoryTestCategory)
  @ManyToOne(
    () => LaboratoryTestCategory,
    (laboratoryTestSubCateogry) => laboratoryTestSubCateogry.laboratoryTests
  )
  subCategory: LaboratoryTestCategory;

  @Field(() => [LaboratoryTestRequest])
  @OneToMany(
    () => LaboratoryTestRequest,
    (laboratoryTestRequest) => laboratoryTestRequest.laboratoryTest
  )
  laboratoryTestRequests: LaboratoryTestRequest[];

  @Field({ nullable: true })
  @Column({ nullable: true })
  price?: number;

  @Field()
  @Column({ default: false })
  hasIndividualPrice: boolean;

  @Field({ nullable: true })
  @Column({ nullable: true })
  inStock?: number;

  @Field()
  @Column({ default: false })
  trackInStock: boolean;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
