import * as TE from "fp-ts/TaskEither";
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
        protected getId: (entity: T) => ID,
        protected getCursor: (entity: T) => CURSOR,
    ) {
        super(getId);
    }

    list(
        options: PaginationOptions<CURSOR>,
    ): TE.TaskEither<RE.RepositoryError<ID>, T[]> {
        return pipe(
            TE.Do,
            TE.map(() => Array.from(this.entities.values())),
            TE.map((entities) => {
                const entitiesAfterCursor = options.cursor
                    ? entities.filter(
                          (entity) => this.getCursor(entity) > options.cursor,
                      )
                    : entities;
                return entitiesAfterCursor.slice(0, options.first);
            }),
        );
    }
}
