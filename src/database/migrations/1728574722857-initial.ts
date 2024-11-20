import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1728574722857 implements MigrationInterface {
    name = 'Initial1728574722857'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_332d10755187ac3c580e21fbc0"`);
        await queryRunner.query(`CREATE TABLE "users" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "email" character varying(100), "username" character varying(100), "phone" character varying(50), "password" text, "name" jsonb NOT NULL DEFAULT '{"firstName":null,"middleName":null,"lastName":null}', "password_last_changed_at" TIMESTAMP, "previous_password" text, "password_wrong_attempt" integer NOT NULL DEFAULT '0', "email_verified_at" TIMESTAMP WITH TIME ZONE, "phone_verified_at" TIMESTAMP WITH TIME ZONE, "country_code" character varying(50), "is_active" boolean NOT NULL DEFAULT true, "registered_at" TIMESTAMP WITH TIME ZONE, "type" character varying(50), "gender" character varying, "dob" date, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "UQ_fe0bb3f6520ee0469504521e710" UNIQUE ("username"), CONSTRAINT "UQ_a000cca60bcf04454e727699490" UNIQUE ("phone"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_51b8b26ac168fbe7d6f5653e6c" ON "users" ("name") `);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "description"`);
        await queryRunner.query(`ALTER TABLE "files" DROP COLUMN "name"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "files" ADD "name" character varying(255)`);
        await queryRunner.query(`ALTER TABLE "files" ADD "description" text`);
        await queryRunner.query(`DROP INDEX "public"."IDX_51b8b26ac168fbe7d6f5653e6c"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`CREATE INDEX "IDX_332d10755187ac3c580e21fbc0" ON "files" ("name") `);
    }

}
