import * as TE from "fp-ts/TaskEither";
import * as RE from "./RepositoryError";

export interface Repository<ID, T> {
    save(entity: T): TE.TaskEither<RE.RepositoryError<ID>, T>;

    find(id: ID): TE.TaskEither<RE.RepositoryError<ID>, T>;

    delete(id: ID): TE.TaskEither<RE.RepositoryError<ID>, void>;
}
