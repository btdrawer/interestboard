import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import { RepositoryOutput } from "./RepositoryOutput";
import { isRepositoryNotFoundError } from "./RepositoryError";

export abstract class Repository<ID, T> {
    constructor(protected idType: t.Type<ID>) {}

    abstract save(entity: T): RepositoryOutput<ID, T>;

    abstract find(id: ID): RepositoryOutput<ID, T>;

    findOpt(id: ID): RepositoryOutput<ID, O.Option<T>> {
        return pipe(
            this.find(id),
            TE.fold(
                (e) =>
                    isRepositoryNotFoundError(e, this.idType)
                        ? TE.right(O.none)
                        : TE.left(e),
                (t) => TE.right(O.some(t)),
            ),
        );
    }

    abstract delete(id: ID): RepositoryOutput<ID, void>;
}
