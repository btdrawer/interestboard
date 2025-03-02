import { Migration } from "@mikro-orm/migrations";

export class V1_CreateUserTable extends Migration {
    async up(): Promise<void> {
        this.addSql(`
        CREATE TABLE "user" (
            "id" UUID PRIMARY KEY,
            "username" VARCHAR(30) NOT NULL,
            "name" TEXT NOT NULL,
            "email" VARCHAR(50) NOT NULL,
            "created" TIMESTAMP NOT NULL,
            "updated" TIMESTAMP NOT NULL
        )`);
    }
}
