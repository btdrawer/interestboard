import * as TE from "fp-ts/TaskEither";
import * as RE from "./RepositoryErrors";

export type PaginationOptions<CURSOR> = {
    first?: number;
    cursor?: CURSOR;
};

export interface PaginatedRepository<ID, CURSOR, T> {
    list(
        options: PaginationOptions<CURSOR>,
    ): TE.TaskEither<RE.RepositoryError<ID>, T[]>;
}
