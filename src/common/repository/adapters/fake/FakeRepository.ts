import * as t from "io-ts";
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { Repository } from "../../Repository";
import * as RE from "../../RepositoryError";

export class FakeRepository<ID, T> extends Repository<ID, T> {
    protected entities: Map<ID, T> = new Map();

    constructor(
        protected idType: t.Type<ID>,
        protected getId: (entity: T) => ID,
    ) {
        super(idType);
    }

    save(entity: T): TE.TaskEither<RE.RepositoryError<ID>, T> {
        return pipe(
            TE.Do,
            TE.map(() => this.entities.set(this.getId(entity), entity)),
            TE.map(() => entity),
        );
    }

    find(id: ID): TE.TaskEither<RE.RepositoryError<ID>, T> {
        return pipe(
            TE.Do,
            TE.map(() => O.fromNullable(this.entities.get(id))),
            TE.chain(
                TE.fromOption(
                    () =>
                        RE.entityNotFoundError<ID>(
                            id,
                        ) as RE.RepositoryError<ID>,
                ),
            ),
        );
    }

    delete(id: ID): TE.TaskEither<RE.RepositoryError<ID>, void> {
        return pipe(
            TE.Do,
            TE.chain(() => this.find(id)),
            TE.map(() => this.entities.delete(id)),
            TE.map(() => undefined),
        );
    }
}
