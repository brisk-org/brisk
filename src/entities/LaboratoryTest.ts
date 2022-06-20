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
import { LaboratoryTestSubCategory } from "./LaboratoryTestSubCategory";

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

  @Field(() => [String], { nullable: true })
  @Column({ type: "simple-array", array: true, nullable: true })
  commonValues?: string[];

  @Field(() => LaboratoryTest, { nullable: true })
  @ManyToOne(
    () => LaboratoryTestCategory,
    (laboratoryTestCategory) => laboratoryTestCategory.laboratoryTests,
    { nullable: true }
  )
  category?: LaboratoryTestCategory;

  @Field(() => LaboratoryTestSubCategory, { nullable: true })
  @ManyToOne(
    () => LaboratoryTestSubCategory,
    (laboratoryTestSubCateogry) => laboratoryTestSubCateogry.laboratoryTests,
    { nullable: true, onDelete: "CASCADE" }
  )
  subCategory?: LaboratoryTestSubCategory;

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
  hasPrice: boolean;

  @Field()
  @Column({ default: false })
  isInfluencedByCategory: boolean;

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
