import { MigrationInterface, QueryRunner } from "typeorm";

export class Init1755010385802 implements MigrationInterface {
    name = 'Init1755010385802'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "categories" ("id" SERIAL NOT NULL, "name" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_8b0be371d28245da6e4f4b61878" UNIQUE ("name"), CONSTRAINT "PK_24dbc6126a28ff948da33e97d3b" PRIMARY KEY ("id")); COMMENT ON COLUMN "categories"."id" IS 'Identificador único de la categoría (Clave primaria autoincremental)'; COMMENT ON COLUMN "categories"."name" IS 'Nombre único de la categoría.'; COMMENT ON COLUMN "categories"."created_at" IS 'Fecha y hora de creación del registro. Se establece automáticamente en la inserción.'; COMMENT ON COLUMN "categories"."updated_at" IS 'Fecha y hora de la última actualización. Se modifica automáticamente en cada actualización.'`);
        await queryRunner.query(`CREATE TABLE "posts" ("id" SERIAL NOT NULL, "title" character varying(255) NOT NULL, "content" text, "cover_image" character varying(255), "summary" character varying(255), "is_draft" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "profile_id" integer NOT NULL, CONSTRAINT "PK_2829ac61eff60fcec60d7274b9e" PRIMARY KEY ("id")); COMMENT ON COLUMN "posts"."id" IS 'Identificador único del post'; COMMENT ON COLUMN "posts"."title" IS 'Título del post'; COMMENT ON COLUMN "posts"."content" IS 'Contenido principal del post'; COMMENT ON COLUMN "posts"."cover_image" IS 'URL de la imagen de portada del post'; COMMENT ON COLUMN "posts"."summary" IS 'Resumen o descripción corta del post'; COMMENT ON COLUMN "posts"."is_draft" IS 'Indica si el post es un borrador'; COMMENT ON COLUMN "posts"."created_at" IS 'Fecha y hora de creación del post'; COMMENT ON COLUMN "posts"."updated_at" IS 'Fecha y hora de la última actualización del post'`);
        await queryRunner.query(`CREATE TABLE "profiles" ("id" SERIAL NOT NULL, "profile_name" character varying(255) NOT NULL, "profile_lastname" character varying(255) NOT NULL, "profile_email" character varying(255) NOT NULL, "profile_avatar" character varying(300), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "user_id" integer NOT NULL, CONSTRAINT "UQ_bffd0e1bf6113b021eb730cfd4c" UNIQUE ("profile_email"), CONSTRAINT "REL_9e432b7df0d182f8d292902d1a" UNIQUE ("user_id"), CONSTRAINT "PK_8e520eb4da7dc01d0e190447c8e" PRIMARY KEY ("id")); COMMENT ON COLUMN "profiles"."profile_name" IS 'Nombre del usuario'; COMMENT ON COLUMN "profiles"."profile_lastname" IS 'apellido del usuario'; COMMENT ON COLUMN "profiles"."profile_email" IS 'Email del usuario, unico por usuario'; COMMENT ON COLUMN "profiles"."profile_avatar" IS 'URL del avatar del usuario'`);
        await queryRunner.query(`CREATE INDEX "IDX_bffd0e1bf6113b021eb730cfd4" ON "profiles" ("profile_email") `);
        await queryRunner.query(`CREATE TABLE "users" ("id" SERIAL NOT NULL, "user_password" character varying(255) NOT NULL, "user_email" character varying(255) NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_643a0bfb9391001cf11e581bdd6" UNIQUE ("user_email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id")); COMMENT ON COLUMN "users"."user_password" IS 'Nombre del usuario'; COMMENT ON COLUMN "users"."user_email" IS 'Email del usuario, unico por usuario'`);
        await queryRunner.query(`CREATE INDEX "IDX_643a0bfb9391001cf11e581bdd" ON "users" ("user_email") `);
        await queryRunner.query(`CREATE TABLE "posts_categories" ("post_id" integer NOT NULL, "category_id" integer NOT NULL, CONSTRAINT "PK_a2686167392213db0acf82f40cc" PRIMARY KEY ("post_id", "category_id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_7aa2cc32acbe04ab0e196977a5" ON "posts_categories" ("post_id") `);
        await queryRunner.query(`CREATE INDEX "IDX_5f604036872bdb8981d298fe3c" ON "posts_categories" ("category_id") `);
        await queryRunner.query(`ALTER TABLE "posts" ADD CONSTRAINT "FK_9dbc2524c6f46641f5e7d107da1" FOREIGN KEY ("profile_id") REFERENCES "profiles"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "profiles" ADD CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "posts_categories" ADD CONSTRAINT "FK_7aa2cc32acbe04ab0e196977a56" FOREIGN KEY ("post_id") REFERENCES "posts"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "posts_categories" ADD CONSTRAINT "FK_5f604036872bdb8981d298fe3ce" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "posts_categories" DROP CONSTRAINT "FK_5f604036872bdb8981d298fe3ce"`);
        await queryRunner.query(`ALTER TABLE "posts_categories" DROP CONSTRAINT "FK_7aa2cc32acbe04ab0e196977a56"`);
        await queryRunner.query(`ALTER TABLE "profiles" DROP CONSTRAINT "FK_9e432b7df0d182f8d292902d1a2"`);
        await queryRunner.query(`ALTER TABLE "posts" DROP CONSTRAINT "FK_9dbc2524c6f46641f5e7d107da1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5f604036872bdb8981d298fe3c"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_7aa2cc32acbe04ab0e196977a5"`);
        await queryRunner.query(`DROP TABLE "posts_categories"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_643a0bfb9391001cf11e581bdd"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_bffd0e1bf6113b021eb730cfd4"`);
        await queryRunner.query(`DROP TABLE "profiles"`);
        await queryRunner.query(`DROP TABLE "posts"`);
        await queryRunner.query(`DROP TABLE "categories"`);
    }

}
