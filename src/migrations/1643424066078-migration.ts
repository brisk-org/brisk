import {MigrationInterface, QueryRunner} from "typeorm";

export class migration1643424066078 implements MigrationInterface {
    name = 'migration1643424066078'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "username" character varying NOT NULL,
                "occupation" character varying NOT NULL,
                "password" character varying NOT NULL,
                "image_url" text,
                "phone" character varying,
                "work_hours" json,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_78a916df40e02a9deb1c4b75edb" UNIQUE ("username"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "attendance" (
                "id" SERIAL NOT NULL,
                "sick_leave" boolean NOT NULL DEFAULT false,
                "late" boolean NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" integer,
                CONSTRAINT "PK_ee0ffe42c1f1a01e72b725c0cb2" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "laboratory_test" (
                "id" SERIAL NOT NULL,
                "cardId" integer NOT NULL,
                "result" json NOT NULL,
                "paid" boolean NOT NULL DEFAULT false,
                "price" integer NOT NULL,
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_08c765b6b3ebc0e0291ebc3bf41" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "history" (
                "id" SERIAL NOT NULL,
                "cardId" integer NOT NULL,
                "result" json NOT NULL,
                "file_path" text,
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
            CREATE TABLE "prescription_test" (
                "id" SERIAL NOT NULL,
                "cardId" integer NOT NULL,
                "result" json NOT NULL,
                "rx" character varying NOT NULL,
                "paid" boolean NOT NULL DEFAULT false,
                "price" integer NOT NULL,
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8aab26d42b430dddd4ae2202cf8" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "card" (
                "id" SERIAL NOT NULL,
                "paper_id" character varying NOT NULL,
                "name" character varying NOT NULL,
                "phone" character varying NOT NULL,
                "age" character varying NOT NULL,
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
            CREATE TABLE "settings" (
                "id" integer NOT NULL,
                "card_price" integer NOT NULL DEFAULT '100',
                "laboratory_tests_data" json NOT NULL,
                "prescription_tests_data" json NOT NULL,
                "card_expiration_date" integer NOT NULL DEFAULT '30',
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_0669fe20e252eb692bf4d344975" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_prescription_test" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL DEFAULT '0',
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "paid" boolean NOT NULL DEFAULT false,
                "result" json NOT NULL,
                "other" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_8cc438a50ee09b97da6e24060ae" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "quick_laboratory_test" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL DEFAULT '0',
                "completed" boolean NOT NULL DEFAULT false,
                "new" boolean NOT NULL DEFAULT true,
                "paid" boolean NOT NULL DEFAULT false,
                "result" json NOT NULL,
                "other" character varying,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_e36a154b20c4737741bd6541811" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "notification" (
                "id" SERIAL NOT NULL,
                "desc" character varying NOT NULL,
                "card_id" integer,
                "laboratory_test_id" integer,
                "prescription_test_id" integer,
                "quick_prescription_test_id" integer,
                "quick_laboratory_test_id" integer,
                "action" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "product" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" integer NOT NULL,
                "desc" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_bebc9158e480b949565b4dc7a82" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            CREATE TABLE "stock" (
                "id" SERIAL NOT NULL,
                "name" character varying NOT NULL,
                "price" character varying NOT NULL,
                "created_at" TIMESTAMP NOT NULL DEFAULT now(),
                "updated_at" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "PK_092bc1fc7d860426a1dec5aa8e9" PRIMARY KEY ("id")
            )
        `);
        await queryRunner.query(`
            ALTER TABLE "attendance"
            ADD CONSTRAINT "FK_466e85b813d871bfb693f443528" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test"
            ADD CONSTRAINT "FK_e9ef41cd988684573b4836bc2e6" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION
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
            ALTER TABLE "prescription_test"
            ADD CONSTRAINT "FK_dfe831ddd0a7e868afd834c4658" FOREIGN KEY ("cardId") REFERENCES "card"("id") ON DELETE CASCADE ON UPDATE NO ACTION
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            ALTER TABLE "prescription_test" DROP CONSTRAINT "FK_dfe831ddd0a7e868afd834c4658"
        `);
        await queryRunner.query(`
            ALTER TABLE "card_sales" DROP CONSTRAINT "FK_156f602073975ae1ae3fb91a73d"
        `);
        await queryRunner.query(`
            ALTER TABLE "history" DROP CONSTRAINT "FK_ab0afc374101e1b5dfb47b3af7d"
        `);
        await queryRunner.query(`
            ALTER TABLE "laboratory_test" DROP CONSTRAINT "FK_e9ef41cd988684573b4836bc2e6"
        `);
        await queryRunner.query(`
            ALTER TABLE "attendance" DROP CONSTRAINT "FK_466e85b813d871bfb693f443528"
        `);
        await queryRunner.query(`
            DROP TABLE "stock"
        `);
        await queryRunner.query(`
            DROP TABLE "product"
        `);
        await queryRunner.query(`
            DROP TABLE "notification"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_laboratory_test"
        `);
        await queryRunner.query(`
            DROP TABLE "quick_prescription_test"
        `);
        await queryRunner.query(`
            DROP TABLE "settings"
        `);
        await queryRunner.query(`
            DROP TABLE "card"
        `);
        await queryRunner.query(`
            DROP TABLE "prescription_test"
        `);
        await queryRunner.query(`
            DROP TABLE "card_sales"
        `);
        await queryRunner.query(`
            DROP TABLE "history"
        `);
        await queryRunner.query(`
            DROP TABLE "laboratory_test"
        `);
        await queryRunner.query(`
            DROP TABLE "attendance"
        `);
        await queryRunner.query(`
            DROP TABLE "user"
        `);
    }

}
