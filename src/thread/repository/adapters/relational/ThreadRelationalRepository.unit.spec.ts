import { MikroORM } from "@mikro-orm/postgresql";
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Thread as ThreadEntity } from "./ThreadEntity";
import { ThreadRelationalRepository } from "./ThreadRelationalRepository";
import { threadRepositoryTest } from "../../ThreadRepository.abstract.spec";

describe("ThreadRelationalRepository", () => {
    let container: StartedPostgreSqlContainer;

    const orm = () =>
        MikroORM.initSync({
            entities: [ThreadEntity],
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

    threadRepositoryTest(() => new ThreadRelationalRepository(orm()));

    afterAll(async () => {
        await container.stop();
    });
});
