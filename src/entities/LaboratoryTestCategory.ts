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
import { LaboratoryTestSubCategory } from "./LaboratoryTestSubCategory";
import { LaboratoryTest } from "./LaboratoryTest";

@ObjectType()
@Entity()
export class LaboratoryTestCategory extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  price?: number;

  @Field(() => [LaboratoryTest])
  @OneToMany(
    () => LaboratoryTest,
    (laboratoryTest) => laboratoryTest.category,
    { onDelete: "CASCADE" }
  )
  laboratoryTests: LaboratoryTest[];

  @Field(() => [LaboratoryTestSubCategory])
  @OneToMany(
    () => LaboratoryTestSubCategory,
    (laboratoryTestSubCategory) => laboratoryTestSubCategory.category,
    { onDelete: "CASCADE" }
  )
  subCateogries: LaboratoryTestSubCategory[];

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
