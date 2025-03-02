import { MikroORM } from "@mikro-orm/postgresql";
import {
    PostgreSqlContainer,
    StartedPostgreSqlContainer,
} from "@testcontainers/postgresql";
import * as U from "../../../types/User";
import { User as UserEntity } from "./UserEntity";
import { UserRelationalRepository } from "./UserRelationalRepository";
import { userEntityFactory } from "../../UserEntityFactory.util.spec";
import { repositoryTest } from "../../../../common/repository/Repository.abstract.spec";

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

    repositoryTest<U.UserId, U.User>(
        () => new UserRelationalRepository(orm()),
        userEntityFactory,
    );

    afterAll(async () => {
        await container.stop();
    });
});
