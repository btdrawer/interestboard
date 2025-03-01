import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as U from "../../../types/User";
import { FakePaginatedRepository } from "../../../../common/repository/adapters/fake/FakePaginatedRepository";
import * as UR from "../../UserRepository";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import * as RE from "../../../../common/repository/RepositoryError";
import {
    MikroORM,
    Entity,
    PrimaryKey,
    Property,
    EntityRepository,
} from "@mikro-orm/core";
import { UUIDBrand } from "io-ts-types";
import { PaginationOptions } from "../../../../common/repository/PaginatedRepository";

@Entity()
export class UserEntity {
    @PrimaryKey()
    id!: U.UserId;

    @Property()
    username!: string;

    @Property()
    name!: string;

    @Property()
    email!: string;

    @Property()
    created!: Date;

    @Property()
    updated!: Date;
}

export class UserPostgresRepository implements UR.UserRepository {
    private entityRepository: EntityRepository<UserEntity>;

    constructor(private orm: MikroORM) {
        this.entityRepository = this.orm.em.getRepository(UserEntity);
    }

    save(user: U.User): RepositoryOutput<U.UserId, U.User> {
        const userEntity = this.createEntity(user);
        return pipe(
            this.callOrm(() => this.entityRepository.upsert(userEntity)),
            TE.map(() => user),
        );
    }

    saveNewUser(user: U.User): RepositoryOutput<U.UserId, U.User> {
        const userEntity = this.createEntity(user);
        return pipe(
            this.callOrm(() => this.entityRepository.insert(userEntity)),
            TE.map(() => user),
        );
    }

    private createEntity(user: U.User): UserEntity {
        const userEntity = new UserEntity();
        userEntity.id = user.id;
        userEntity.username = user.username;
        userEntity.name = user.name;
        userEntity.email = user.email;
        userEntity.created = user.created;
        userEntity.updated = user.updated;
        return userEntity;
    }

    find(id: U.UserId): RepositoryOutput<U.UserId, U.User> {
        return pipe(
            this.callOrm(() => this.entityRepository.findOneOrFail(id)),
            TE.map((entity) => ({
                id: entity.id,
                username: entity.username,
                name: entity.name,
                email: entity.email,
                created: entity.created,
                updated: entity.updated,
            })),
        );
    }

    findByIds(
        ids: NonEmptyArray<U.UserId>,
    ): RepositoryOutput<U.UserId, U.User[]> {
        return pipe(
            this.callOrm(() => this.entityRepository.find(ids)),
            TE.map((entities) =>
                entities.map((entity) => ({
                    id: entity.id,
                    username: entity.username,
                    name: entity.name,
                    email: entity.email,
                    created: entity.created,
                    updated: entity.updated,
                })),
            ),
        );
    }

    list(
        options: PaginationOptions<string>,
    ): RepositoryOutput<U.UserId, U.User[]> {
        return pipe(
            this.callOrm(() =>
                this.entityRepository.findAndCount(
                    {},
                    {
                        limit: options.limit,
                        offset: options.offset,
                    },
                ),
            ),
            TE.map(([entities]) =>
                entities.map((entity) => ({
                    id: entity.id,
                    username: entity.username,
                    name: entity.name,
                    email: entity.email,
                    created: entity.created,
                    updated: entity.updated,
                })),
            ),
        );
    }

    delete(id: U.UserId): RepositoryOutput<U.UserId, void> {
        return pipe(
            this.callOrm(() => this.entityRepository.nativeDelete({ id })),
            TE.map(() => undefined),
        );
    }

    private callOrm<T>(fn: () => Promise<T>): RepositoryOutput<U.UserId, T> {
        return pipe(
            TE.tryCatch(fn, (err) =>
                RE.repositoryInternalError([], (err as any).message),
            ),
            TE.map((result) => result),
        );
    }
}
