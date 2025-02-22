import { RepositoryOutput } from "./RepositoryOutput";

export type PaginationOptions<CURSOR> = {
    first: number;
    cursor?: CURSOR;
};

export interface PaginatedRepository<ID, CURSOR, T> {
    list(options: PaginationOptions<CURSOR>): RepositoryOutput<ID, T[]>;
}
