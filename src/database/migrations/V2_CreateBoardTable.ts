import { Migration } from "@mikro-orm/migrations";

export class V2_CreateBoardTable extends Migration {
    async up(): Promise<void> {
        this.addSql(`
        CREATE TABLE "board" (
            "id" UUID PRIMARY KEY,
            "name" VARCHAR(50) NOT NULL,
            "title" VARCHAR(100) NOT NULL,
            "description" TEXT NOT NULL,
            "subscribers" INTEGER NOT NULL,
            "locked" BOOLEAN NOT NULL,
            "created" TIMESTAMP NOT NULL,
            "updated" TIMESTAMP NOT NULL
        )`);
        this.addSql(`
        CREATE TABLE "board_moderators" (
            "board_id" UUID NOT NULL REFERENCES "board" ("id"),
            "user_id" UUID NOT NULL REFERENCES "user" ("id"),
            PRIMARY KEY ("board_id", "user_id")
        )`);
    }
}
