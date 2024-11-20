import { MigrationInterface, QueryRunner } from "typeorm";

export class Entity1728759950735 implements MigrationInterface {
    name = 'Entity1728759950735'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "type" SET DEFAULT 'CUSTOMER'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "type" DROP DEFAULT`);
    }

}
