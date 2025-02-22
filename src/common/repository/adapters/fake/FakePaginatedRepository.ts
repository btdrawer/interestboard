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

export class FakePaginatedRepository<ID, CURSOR, T>
    extends FakeRepository<ID, T>
    implements PaginatedRepository<ID, CURSOR, T>
{
    constructor(
        protected idType: t.Type<ID>,
        protected getId: (entity: T) => ID,
        protected getCursor: (entity: T) => CURSOR,
    ) {
        super(idType, getId);
    }

    list(
        options: PaginationOptions<CURSOR>,
    ): TE.TaskEither<RE.RepositoryError<ID>, T[]> {
        return pipe(
            TE.Do,
            TE.map(() => Array.from(this.entities.values())),
            TE.map((entities) => {
                const entitiesAfterCursor = O.fold<CURSOR, T[]>(
                    () => entities,
                    (cursor) =>
                        entities.filter(
                            (entity) => this.getCursor(entity) > cursor,
                        ),
                )(O.fromNullable(options.cursor));
                return entitiesAfterCursor.slice(0, options.first);
            }),
        );
    }
}
