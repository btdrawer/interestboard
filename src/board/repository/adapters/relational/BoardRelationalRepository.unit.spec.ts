import { MikroORM } from "@mikro-orm/postgresql";
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import { Board as BoardEntity } from "./BoardEntity";
import { BoardRelationalRepository } from "./BoardRelationalRepository";
import { boardRepositoryTest } from "../../BoardRepository.abstract.spec";

describe("BoardRelationalRepository", () => {
    let container: StartedPostgreSqlContainer;

    const orm = () =>
        MikroORM.initSync({
            entities: [BoardEntity],
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

    boardRepositoryTest(() => new BoardRelationalRepository(orm()));

    afterAll(async () => {
        await container.stop();
    });
});
