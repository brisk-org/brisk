import { Field, ID, ObjectType } from "type-graphql";
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  BaseEntity,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { LaboratoryTestCategory } from "./LaboratoryTestCategory";
import { LaboratoryTest } from "./LaboratoryTest";

@ObjectType()
@Entity()
export class LaboratoryTestSubCategory extends BaseEntity {
  @Field(() => ID!)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  price?: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  inStock?: number;

  @Field()
  @Column({ default: false })
  trackInStock: boolean;

  @Field(() => [LaboratoryTest])
  @OneToMany(() => LaboratoryTest, (laboratoryTest) => laboratoryTest.category)
  laboratoryTests: LaboratoryTest[];

  @Field(() => LaboratoryTestCategory)
  @ManyToOne(
    () => LaboratoryTestCategory,
    (laboratoryTest) => laboratoryTest.subCategories
  )
  category: LaboratoryTestCategory;

  @Field(() => String)
  @CreateDateColumn()
  created_at: Date;

  @Field(() => String)
  @UpdateDateColumn()
  updated_at: Date;
}
