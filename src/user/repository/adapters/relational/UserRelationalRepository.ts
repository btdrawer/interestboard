import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import * as NEA from "fp-ts/NonEmptyArray";
import { MikroORM } from "@mikro-orm/core";
import * as U from "../../../types/User";
import { User as UserEntity } from "./UserEntity";
import { RelationalPaginatedRepository } from "../../../../common/repository/adapters/relational/RelationalPaginatedRepository";
import * as UR from "../../UserRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";

export const userIdColumnName = "id";
export const userCursorColumnNames = [
    "id",
    "created",
] as NEA.NonEmptyArray<string>;

export class UserRelationalRepository
    extends RelationalPaginatedRepository<U.UserId, U.User, UserEntity>
    implements UR.UserRepository
{
    constructor(protected orm: MikroORM) {
        super(
            U.userId.type as unknown as t.Type<U.UserId>,
            UR.getId,
            userIdColumnName,
            userCursorColumnNames,
            orm,
            UserEntity,
        );
    }

    protected createEntity(user: U.User): UserEntity {
        const entity = new UserEntity();
        entity.id = this.getId(user);
        entity.username = user.username;
        entity.name = user.name;
        entity.email = user.email;
        entity.created = user.created;
        entity.updated = user.updated;
        return entity;
    }

    protected fromEntity(entity: UserEntity): U.User {
        return {
            id: entity.id,
            username: entity.username,
            name: entity.name,
            email: entity.email,
            created: entity.created,
            updated: entity.updated,
        };
    }

    saveNewUser(user: U.User): RepositoryOutput<U.UserId, U.User> {
        const entityToSave = this.createEntity(user);
        return pipe(
            this.callOrm([this.getId(user)], () =>
                this.entityRepository.insert(entityToSave),
            ),
            TE.map(() => user),
        );
    }

    findByIds(
        ids: NEA.NonEmptyArray<U.UserId>,
    ): RepositoryOutput<U.UserId, U.User[]> {
        return pipe(
            this.callOrm([], () =>
                this.entityRepository.find({
                    id: { $in: ids },
                }),
            ),
            TE.map((entities) => entities.map(this.fromEntity)),
        );
    }
}
