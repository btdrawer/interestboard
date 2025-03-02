import * as O from "fp-ts/Option";
import { Repository } from "./Repository";
import { RepositoryOutput } from "./RepositoryOutput";

export type PaginationOptions = {
    first: number;
    cursor: O.Option<string>;
};

export abstract class PaginatedRepository<ID, T> extends Repository<ID, T> {
    // TODO should return cursor as well
    abstract list(options: PaginationOptions): RepositoryOutput<ID, T[]>;
}
