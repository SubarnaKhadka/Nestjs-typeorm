import { MigrationInterface, QueryRunner } from "typeorm";

export class CountryCode1728581038490 implements MigrationInterface {
    name = 'CountryCode1728581038490'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "country_code" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "country_code" SET DEFAULT '+977'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "country_code" DROP DEFAULT`);
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "country_code" DROP NOT NULL`);
    }

}
