import { MigrationInterface, QueryRunner } from "typeorm";

export class NewFields1755015600533 implements MigrationInterface {
    name = 'NewFields1755015600533'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "categories" ADD "category_description" character varying(800)`);
        await queryRunner.query(`COMMENT ON COLUMN "categories"."category_description" IS 'Descripcion de la categoría.'`);
        await queryRunner.query(`ALTER TABLE "categories" ADD "cover_image" character varying(800)`);
        await queryRunner.query(`COMMENT ON COLUMN "categories"."cover_image" IS 'Descripcion de la categoría.'`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "cover_image"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "cover_image" character varying(800)`);
        await queryRunner.query(`COMMENT ON COLUMN "posts"."cover_image" IS 'URL de la imagen de portada del post'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`COMMENT ON COLUMN "posts"."cover_image" IS 'URL de la imagen de portada del post'`);
        await queryRunner.query(`ALTER TABLE "posts" DROP COLUMN "cover_image"`);
        await queryRunner.query(`ALTER TABLE "posts" ADD "cover_image" character varying(255)`);
        await queryRunner.query(`COMMENT ON COLUMN "categories"."cover_image" IS 'Descripcion de la categoría.'`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "cover_image"`);
        await queryRunner.query(`COMMENT ON COLUMN "categories"."category_description" IS 'Descripcion de la categoría.'`);
        await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "category_description"`);
    }

}
