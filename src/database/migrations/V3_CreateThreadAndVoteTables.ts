import { Migration } from "@mikro-orm/migrations";

export class V3_CreateThreadAndVoteTables extends Migration {
    async up(): Promise<void> {
        this.addSql(`
        CREATE TABLE "thread" (
            "id" UUID PRIMARY KEY,
            "author_id" UUID NOT NULL REFERENCES "user" ("id"),
            "board_id" UUID NOT NULL REFERENCES "board" ("id"),
            "parent_id" UUID REFERENCES "thread" ("id"),
            "body" TEXT NOT NULL,
            "upvotes" INT NOT NULL,
            "downvotes" INT NOT NULL,
            "created" TIMESTAMP NOT NULL,
            "updated" TIMESTAMP NOT NULL,
            "deleted" TIMESTAMP
        )`);
        this.addSql(`
        CREATE TABLE "vote" (
            "id" UUID PRIMARY KEY,
            "user_id" UUID NOT NULL REFERENCES "user" ("id"),
            "thread_id" UUID NOT NULL REFERENCES "thread" ("id"),
            "parent_id" UUID REFERENCES "thread" ("id"),
            "type" TEXT NOT NULL,
            "created" TIMESTAMP NOT NULL,
            "updated" TIMESTAMP NOT NULL
        )`);
    }
}
