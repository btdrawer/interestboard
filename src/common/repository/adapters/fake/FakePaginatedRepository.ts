import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import {
    PaginatedRepository,
    PaginationOptions,
} from "../../PaginatedRepository";
import * as RE from "../../RepositoryError";
import { FakeRepository } from "./FakeRepository";

export class FakePaginatedRepository<ID, T>
    extends FakeRepository<ID, T>
    implements PaginatedRepository<ID, T>
{
    constructor(
        protected entities: Map<ID, T>,
        protected idType: t.Type<ID>,
        protected getId: (entity: T) => ID,
        protected getCursor: (entity: T) => string,
    ) {
        super(entities, idType, getId);
    }

    list(
        options: PaginationOptions,
    ): TE.TaskEither<RE.RepositoryError<ID>, T[]> {
        return this.listWithFilter(() => true)(options);
    }

    protected listWithFilter(predicate: (entity: T) => boolean) {
        return (options: PaginationOptions) =>
            pipe(
                TE.Do,
                TE.map(() =>
                    Array.from(this.entities.values()).filter(predicate),
                ),
                TE.map(this.applyPaginationToList(options)),
            );
    }

    private applyPaginationToList(options: PaginationOptions) {
        return (entities: T[]) => {
            const entitiesAfterCursor = O.fold<string, T[]>(
                () => entities,
                (cursor) =>
                    entities.filter(
                        (entity) => this.getCursor(entity) > cursor,
                    ),
            )(options.cursor);
            return entitiesAfterCursor.slice(0, options.first);
        };
    }
}
