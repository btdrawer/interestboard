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
        this.entityRepository = this.orm.em.getRepository(entityName);
    }

    abstract createEntity(entity: T): ENTITY;

    abstract fromEntity(entity: ENTITY): T;

    save(entity: T): RepositoryOutput<ID, T> {
        const entityToSave = this.createEntity(entity);
        return pipe(
            this.callOrm([this.getId(entity)], () =>
                this.entityRepository.upsert(entityToSave),
            ),
            TE.map(() => entity),
        );
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
            this.callOrm([id], () =>
                this.entityRepository.nativeDelete({
                    [this.idColumnName]: id,
                } as FilterQuery<ENTITY>),
            ),
            TE.map(() => undefined),
        );
    }

    protected callOrm<A>(
        ids: ID[],
        fn: () => Promise<A>,
    ): TE.TaskEither<RE.RepositoryError<ID>, A> {
        return pipe(
            TE.tryCatch(fn, (error) => {
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
                return RE.repositoryInternalError(
                    ids,
                    "An unknown error occurred.",
                );
            }),
        );
    }
}
