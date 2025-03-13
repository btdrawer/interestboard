import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import {
    MikroORM,
    EntityRepository,
    EntityName,
    FilterQuery,
    ForeignKeyConstraintViolationException,
    NotNullConstraintViolationException,
    UniqueConstraintViolationException,
    DriverException,
} from "@mikro-orm/core";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import * as RE from "../../../../common/repository/RepositoryError";
import { Repository } from "../../Repository";

export abstract class RelationalRepository<
    ID,
    T,
    ENTITY extends object,
> extends Repository<ID, T> {
    protected entityRepository: EntityRepository<ENTITY>;

    constructor(
        protected idType: t.Type<ID>,
        protected getId: (entity: T) => ID,
        protected idColumnName: string,
        protected orm: MikroORM,
        protected entityName: EntityName<ENTITY>,
    ) {
        super(idType);
        this.entityRepository = this.orm.em.fork().getRepository(entityName);
    }

    protected abstract createEntity(entity: T): ENTITY;

    protected abstract fromEntity(entity: ENTITY): T;

    save(entity: T): RepositoryOutput<ID, T> {
        const entityToSave = this.createEntity(entity);
        return pipe(
            this.callOrm([this.getId(entity)], () =>
                this.saveOperation(entityToSave),
            ),
            TE.map(() => entity),
        );
    }

    async saveOperation(entity: ENTITY): Promise<void> {
        await this.entityRepository.upsert(entity);
    }

    find(id: ID): RepositoryOutput<ID, T> {
        return pipe(
            TE.Do,
            TE.chain(() =>
                this.callOrm([id], () =>
                    this.entityRepository.findOne({
                        [this.idColumnName]: id,
                    } as FilterQuery<ENTITY>),
                ),
            ),
            TE.chain((loaded) =>
                loaded
                    ? TE.right(this.fromEntity(loaded))
                    : TE.left(RE.entityNotFoundError(id)),
            ),
        );
    }

    delete(id: ID): RepositoryOutput<ID, void> {
        return pipe(
            this.callOrm([id], () => this.deleteOperation(id)),
            TE.chain((result) =>
                result === 1
                    ? TE.right(undefined)
                    : TE.left(RE.entityNotFoundError(id)),
            ),
        );
    }

    deleteOperation(id: ID): Promise<number> {
        return this.entityRepository.nativeDelete({
            [this.idColumnName]: id,
        } as FilterQuery<ENTITY>);
    }

    protected callOrm<A>(
        ids: ID[],
        fn: () => Promise<A>,
    ): TE.TaskEither<RE.RepositoryError<ID>, A> {
        return pipe(
            TE.tryCatch(fn, (error) => {
                if (RE.isRepositoryError(error, this.idType)) {
                    return error;
                }
                if (
                    error instanceof NotNullConstraintViolationException ||
                    error instanceof UniqueConstraintViolationException
                ) {
                    return RE.badRequestError(ids, error.message);
                }
                if (error instanceof ForeignKeyConstraintViolationException) {
                    return RE.entityNotFoundError(ids[0]);
                }
                if (error instanceof DriverException) {
                    return RE.repositoryInternalError(ids, error.message);
                }
                console.error(
                    `Unknown error in repository for entity ${this.entityName} with ids ${ids}`,
                    error,
                );
                return RE.repositoryInternalError(
                    ids,
                    "An unknown error occurred.",
                );
            }),
        );
    }
}
