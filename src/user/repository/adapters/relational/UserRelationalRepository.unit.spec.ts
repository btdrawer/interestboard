import { MikroORM } from "@mikro-orm/postgresql";
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { User as UserEntity } from "./UserEntity";
import { UserRelationalRepository } from "./UserRelationalRepository";
import { userRepositoryTest } from "../../UserRepository.abstract.spec";

describe("UserRelationalRepository", () => {
    let container: StartedPostgreSqlContainer;

    const orm = () =>
        MikroORM.initSync({
            entities: [UserEntity],
            dbName: "postgres",
            migrations: {
                tableName: "migrations",
                path: "dist/database/migrations",
                pathTs: "src/database/migrations",
            },
        });

    beforeAll(async () => {
        container = await new PostgreSqlContainer().start();
        const migrator = orm().getMigrator();
        await migrator.up();
    });

    userRepositoryTest(() => new UserRelationalRepository(orm()));

    afterAll(async () => {
        await container.stop();
    });
});
