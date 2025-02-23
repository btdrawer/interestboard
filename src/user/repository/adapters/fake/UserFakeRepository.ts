import * as t from "io-ts";
import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as U from "../../../types/User";
import { FakePaginatedRepository } from "../../../../common/repository/adapters/fake/FakePaginatedRepository";
import * as UR from "../../UserRepository";
import { NonEmptyArray } from "fp-ts/lib/NonEmptyArray";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import * as RE from "../../../../common/repository/RepositoryError";

export class UserFakeRepository
    extends FakePaginatedRepository<U.UserId, U.UserCursor, U.User>
    implements UR.UserRepository
{
    constructor() {
        super(
            U.userId.type as unknown as t.Type<U.UserId>, // TODO not sure why this doesn't work
            UR.getId,
            UR.getCursor,
        );
    }

    saveNewUser(user: U.User): RepositoryOutput<U.UserId, U.User> {
        return pipe(
            TE.Do,
            TE.chain(() => this.findOpt(user.id)),
            TE.chain(
                O.fold(
                    () => this.save(user),
                    () =>
                        TE.left(
                            RE.badRequestError(
                                [user.id],
                                "User already exists.",
                            ),
                        ),
                ),
            ),
        );
    }

    findByIds(
        ids: NonEmptyArray<U.UserId>,
    ): RepositoryOutput<U.UserId, U.User[]> {
        return TE.right(
            Array.from(this.entities.values()).filter((entity) =>
                ids.includes(this.getId(entity)),
            ),
        );
    }
}
