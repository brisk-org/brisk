import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1670304691292 implements MigrationInterface {
    name = 'migration1670304691292'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "laboratory_test_sub_category" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "inStock" integer,
                "trackInStock" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "categoryId" integer,
                CONSTRAINT "PK_fde63c149d3e7d85c3f97e10a72" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "laboratory_test_category" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer,
                "inStock" integer,
                "trackInStock" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e718a17e0f970548267c1c86dda" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "laboratory_test" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "normalValue" character varying NOT NULL,
                "commonValues" text array,
                "price" integer,
                "hasPrice" boolean NOT NULL DEFAULT false,
                "isInfluencedByCategory" boolean NOT NULL DEFAULT false,
                "inStock" integer,
                "trackInStock" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "categoryId" integer,
                "subCategoryId" integer,
                CONSTRAINT "PK_08c765b6b3ebc0e0291ebc3bf41" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "medicine" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "inStock" integer NOT NULL,
                "strength" character varying,
                "perDay" character varying,
                "forDays" integer,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_b9e0e6f37b7cadb5f402390928b" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "medication" (
                "id" SERIAL NOT NULL,
                "medicineId" integer NOT NULL,
                "strength" character varying,
                "perDay" character varying NOT NULL,
                "checkIn" json NOT NULL,
                "forDays" integer NOT NULL,
                "other" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "prescriptionId" integer,
                CONSTRAINT "PK_0682f5b7379fea3c2fdb77d6545" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "prescription" (
                "id" SERIAL NOT NULL,
                "cardId" integer NOT NULL,
                "rx" character varying NOT NULL,
                "paid" boolean NOT NULL DEFAULT false,
                "inrolled" boolean NOT NULL DEFAULT false,
                "price" integer NOT NULL,
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_eaba5e4414e5382781e08467b51" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_medicine" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "prescriptionId" integer,
                CONSTRAINT "PK_a5f9c559e927a14b533f7453f4e" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_prescription" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL DEFAULT '0',
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "paid" boolean NOT NULL DEFAULT false,
                "other" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_154f043befbe253618d7107f3a6" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_laboratory_test" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e36a154b20c4737741bd6541811" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_laboratory_examination" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL DEFAULT '0',
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "paid" boolean NOT NULL DEFAULT false,
                "result" character varying,
                "other" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0c70cb34c3bf72f0912848d8fda" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "notification" (
                "id" SERIAL NOT NULL,
                "for" character varying array NOT NULL,
                "message" character varying NOT NULL,
                "action" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "cardId" integer,
                "laboratoryTestId" integer,
                "prescriptionId" integer,
                "quickPrescriptionTestId" integer,
                "quickLaboratoryTestId" integer,
                CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "laboratory_examination" (
                "id" SERIAL NOT NULL,
                "cardId" integer NOT NULL,
                "values" json,
                "paid" boolean NOT NULL DEFAULT false,
                "price" integer NOT NULL,
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_3194785a8466ac46637bf48bec7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "history" (
                "id" SERIAL NOT NULL,
                "cardId" integer NOT NULL,
                "result" json NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9384942edf4804b38ca0ee51416" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "card_sales" (
                "id" SERIAL NOT NULL,
                "price" integer NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "cardId" integer,
                CONSTRAINT "PK_f7a2b9656de92e955bd4e226d41" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "card" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "age" smallint NOT NULL,
                "new" boolean NOT NULL DEFAULT true,
                "valid" boolean NOT NULL DEFAULT true,
                "visited_count" integer NOT NULL DEFAULT '1',
                "gender" character varying NOT NULL,
                "address" character varying,
                "k_ketema" character varying,
                "kebele" character varying,
                "house_no" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_9451069b6f1199730791a7f4ae4" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "consultaion" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "age" smallint NOT NULL,
                "new" boolean NOT NULL DEFAULT true,
                "valid" boolean NOT NULL DEFAULT true,
                "visited_count" integer NOT NULL DEFAULT '1',
                "gender" character varying NOT NULL,
                "address" character varying,
                "k_ketema" character varying,
                "kebele" character varying,
                "house_no" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_056b9803bc709b5147e693e6cd0" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "occupation" character varying NOT NULL,
                "password" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "settings" (
                "id" integer NOT NULL,
                "card_price" integer NOT NULL DEFAULT '100',
                "card_expiration_date" integer NOT NULL DEFAULT '30',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "laboratory_test_request" (
                "id" SERIAL NOT NULL,
                "value" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_da2c8951ac017902e9637066a25" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_prescription_medicines_quick_medicine" (
                "quickPrescriptionId" integer NOT NULL,
                "quickMedicineId" integer NOT NULL,
                CONSTRAINT "PK_03e1e0805b0eb40d3528da5a937" PRIMARY KEY ("quickPrescriptionId", "quickMedicineId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_02bd95f01d494f932597b1d1c5" ON "quick_prescription_medicines_quick_medicine" ("quickPrescriptionId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_4c1564fa657e9ca87d20c5748b" ON "quick_prescription_medicines_quick_medicine" ("quickMedicineId")
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_laboratory_examination_tests_quick_laboratory_test" (
                "quickLaboratoryExaminationId" integer NOT NULL,
                "quickLaboratoryTestId" integer NOT NULL,
                CONSTRAINT "PK_014727d01649e86fb4a5e0e40fc" PRIMARY KEY (
                    "quickLaboratoryExaminationId",
                    "quickLaboratoryTestId"
                )
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_08834242cae044b4bdb67a94e9" ON "quick_laboratory_examination_tests_quick_laboratory_test" ("quickLaboratoryExaminationId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_78fe4aa459d968d67c811bf1a7" ON "quick_laboratory_examination_tests_quick_laboratory_test" ("quickLaboratoryTestId")
        `);
        await queryRunner.query(`
            CREATE TABLE "laboratory_examination_laboratory_tests_laboratory_test" (
                "laboratoryExaminationId" integer NOT NULL,
                "laboratoryTestId" integer NOT NULL,
                CONSTRAINT "PK_5271f4046648a669de67f68c88a" PRIMARY KEY ("laboratoryExaminationId", "laboratoryTestId")
            )
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_f800aeb90e041de67a3c2d5e79" ON "laboratory_examination_laboratory_tests_laboratory_test" ("laboratoryExaminationId")
        `);
        await queryRunner.query(`
            CREATE INDEX "IDX_924bd2638e2ba63294b7fd0870" ON "laboratory_examination_laboratory_tests_laboratory_test" ("laboratoryTestId")
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test_sub_category"
            ADD CONSTRAINT "FK_1c5508acfa8c85116d40ba968ef" FOREIGN KEY ("categoryId") REFERENCES "laboratory_test_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test"
            ADD CONSTRAINT "FK_91e3fddea87b218c9af761d61e0" FOREIGN KEY ("categoryId") REFERENCES "laboratory_test_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test"
            ADD CONSTRAINT "FK_02cac1db73a5ef9cb3b44f82e36" FOREIGN KEY ("subCategoryId") REFERENCES "laboratory_test_sub_category"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "medication"
            ADD CONSTRAINT "FK_b16bf0e2eee13d62ec3d5ac884a" FOREIGN KEY ("medicineId") REFERENCES "medicine"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "medication"
            ADD CONSTRAINT "FK_13fba2f48843ee8993100743a83" FOREIGN KEY ("prescriptionId") REFERENCES "prescription"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "prescription"
            ADD CONSTRAINT "FK_1ecf8b813457f3973664bb1c417" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_medicine"
            ADD CONSTRAINT "FK_5b804a95eda4255043e37558aa4" FOREIGN KEY ("prescriptionId") REFERENCES "quick_prescription"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_58b852c8ba4f3ab1a7b56f0805c" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_401b3a86b7896a73d79cc46d7cc" FOREIGN KEY ("laboratoryTestId") REFERENCES "laboratory_examination"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_98f58a929e26e174b2e8b460d94" FOREIGN KEY ("prescriptionId") REFERENCES "prescription"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_353abd44ae94628992aec3c6fb6" FOREIGN KEY ("quickPrescriptionTestId") REFERENCES "quick_prescription"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "notification"
            ADD CONSTRAINT "FK_dadf3f378174fdd0124d036b87a" FOREIGN KEY ("quickLaboratoryTestId") REFERENCES "quick_laboratory_examination"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_examination"
            ADD CONSTRAINT "FK_ef113fe38a43c678da53619c343" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "history"
            ADD CONSTRAINT "FK_ab0afc374101e1b5dfb47b3af7d" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "card_sales"
            ADD CONSTRAINT "FK_156f602073975ae1ae3fb91a73d" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_prescription_medicines_quick_medicine"
            ADD CONSTRAINT "FK_02bd95f01d494f932597b1d1c5c" FOREIGN KEY ("quickPrescriptionId") REFERENCES "quick_prescription"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_prescription_medicines_quick_medicine"
            ADD CONSTRAINT "FK_4c1564fa657e9ca87d20c5748b4" FOREIGN KEY ("quickMedicineId") REFERENCES "quick_medicine"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_laboratory_examination_tests_quick_laboratory_test"
            ADD CONSTRAINT "FK_08834242cae044b4bdb67a94e9a" FOREIGN KEY ("quickLaboratoryExaminationId") REFERENCES "quick_laboratory_examination"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_laboratory_examination_tests_quick_laboratory_test"
            ADD CONSTRAINT "FK_78fe4aa459d968d67c811bf1a72" FOREIGN KEY ("quickLaboratoryTestId") REFERENCES "quick_laboratory_test"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_examination_laboratory_tests_laboratory_test"
            ADD CONSTRAINT "FK_f800aeb90e041de67a3c2d5e799" FOREIGN KEY ("laboratoryExaminationId") REFERENCES "laboratory_examination"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_examination_laboratory_tests_laboratory_test"
            ADD CONSTRAINT "FK_924bd2638e2ba63294b7fd08708" FOREIGN KEY ("laboratoryTestId") REFERENCES "laboratory_test"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "laboratory_examination_laboratory_tests_laboratory_test" DROP CONSTRAINT "FK_924bd2638e2ba63294b7fd08708"
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_examination_laboratory_tests_laboratory_test" DROP CONSTRAINT "FK_f800aeb90e041de67a3c2d5e799"
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_laboratory_examination_tests_quick_laboratory_test" DROP CONSTRAINT "FK_78fe4aa459d968d67c811bf1a72"
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_laboratory_examination_tests_quick_laboratory_test" DROP CONSTRAINT "FK_08834242cae044b4bdb67a94e9a"
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_prescription_medicines_quick_medicine" DROP CONSTRAINT "FK_4c1564fa657e9ca87d20c5748b4"
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_prescription_medicines_quick_medicine" DROP CONSTRAINT "FK_02bd95f01d494f932597b1d1c5c"
        `);
        await queryRunner.query(`
            ALTER TABLE "card_sales" DROP CONSTRAINT "FK_156f602073975ae1ae3fb91a73d"
        `);
        await queryRunner.query(`
            ALTER TABLE "history" DROP CONSTRAINT "FK_ab0afc374101e1b5dfb47b3af7d"
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_examination" DROP CONSTRAINT "FK_ef113fe38a43c678da53619c343"
        `);
        await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_dadf3f378174fdd0124d036b87a"
        `);
        await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_353abd44ae94628992aec3c6fb6"
        `);
        await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_98f58a929e26e174b2e8b460d94"
        `);
        await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_401b3a86b7896a73d79cc46d7cc"
        `);
        await queryRunner.query(`
            ALTER TABLE "notification" DROP CONSTRAINT "FK_58b852c8ba4f3ab1a7b56f0805c"
        `);
        await queryRunner.query(`
            ALTER TABLE "quick_medicine" DROP CONSTRAINT "FK_5b804a95eda4255043e37558aa4"
        `);
        await queryRunner.query(`
            ALTER TABLE "prescription" DROP CONSTRAINT "FK_1ecf8b813457f3973664bb1c417"
        `);
        await queryRunner.query(`
            ALTER TABLE "medication" DROP CONSTRAINT "FK_13fba2f48843ee8993100743a83"
        `);
        await queryRunner.query(`
            ALTER TABLE "medication" DROP CONSTRAINT "FK_b16bf0e2eee13d62ec3d5ac884a"
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test" DROP CONSTRAINT "FK_02cac1db73a5ef9cb3b44f82e36"
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test" DROP CONSTRAINT "FK_91e3fddea87b218c9af761d61e0"
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test_sub_category" DROP CONSTRAINT "FK_1c5508acfa8c85116d40ba968ef"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_924bd2638e2ba63294b7fd0870"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_f800aeb90e041de67a3c2d5e79"
        `);
        await queryRunner.query(`
            DROP TABLE "laboratory_examination_laboratory_tests_laboratory_test"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_78fe4aa459d968d67c811bf1a7"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_08834242cae044b4bdb67a94e9"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_laboratory_examination_tests_quick_laboratory_test"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_4c1564fa657e9ca87d20c5748b"
        `);
        await queryRunner.query(`
            DROP INDEX "IDX_02bd95f01d494f932597b1d1c5"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_prescription_medicines_quick_medicine"
        `);
        await queryRunner.query(`
            DROP TABLE "laboratory_test_request"
        `);
        await queryRunner.query(`
            DROP TABLE "settings"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
        await queryRunner.query(`
            DROP TABLE "consultaion"
        `);
        await queryRunner.query(`
            DROP TABLE "card"
        `);
        await queryRunner.query(`
            DROP TABLE "card_sales"
        `);
        await queryRunner.query(`
            DROP TABLE "history"
        `);
        await queryRunner.query(`
            DROP TABLE "laboratory_examination"
        `);
        await queryRunner.query(`
            DROP TABLE "notification"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_laboratory_examination"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_laboratory_test"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_prescription"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_medicine"
        `);
        await queryRunner.query(`
            DROP TABLE "prescription"
        `);
        await queryRunner.query(`
            DROP TABLE "medication"
        `);
        await queryRunner.query(`
            DROP TABLE "medicine"
        `);
        await queryRunner.query(`
            DROP TABLE "laboratory_test"
        `);
        await queryRunner.query(`
            DROP TABLE "laboratory_test_category"
        `);
        await queryRunner.query(`
            DROP TABLE "laboratory_test_sub_category"
        `);
    }

}
