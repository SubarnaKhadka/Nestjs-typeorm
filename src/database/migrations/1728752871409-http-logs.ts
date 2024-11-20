import { MigrationInterface, QueryRunner } from "typeorm";

export class HttpLogs1728752871409 implements MigrationInterface {
    name = 'HttpLogs1728752871409'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "http-logs" ("id" BIGSERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "method" text, "timezone" text, "remote_address" text, "remote_user_id" integer, "url" text, "query_params" jsonb, "metadata" jsonb, "params" jsonb, "user_agent" text, "hostname" text, "timestamp" bigint, "response_code" integer, "response_time" integer, CONSTRAINT "PK_b15535e31ec6bf8a305292ae25d" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "http-logs"`);
    }

}
