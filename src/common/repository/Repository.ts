import { RepositoryOutput } from "./RepositoryOutput";

export interface Repository<ID, T> {
    save(entity: T): RepositoryOutput<ID, T>;

    find(id: ID): RepositoryOutput<ID, T>;

    delete(id: ID): RepositoryOutput<ID, void>;
}
