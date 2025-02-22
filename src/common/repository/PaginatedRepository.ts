import { Repository } from "./Repository";
import { RepositoryOutput } from "./RepositoryOutput";

export type PaginationOptions<CURSOR> = {
    first: number;
    cursor?: CURSOR;
};

export abstract class PaginatedRepository<ID, CURSOR, T> extends Repository<
    ID,
    T
> {
    abstract list(
        options: PaginationOptions<CURSOR>,
    ): RepositoryOutput<ID, T[]>;
}
