import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";
import * as U from "../contract/User";
import * as UE from "../contract/UserError";
import { UserFacade } from "../contract/UserFacade";
import { UserRepository } from "../repository/UserRepository";
import * as RE from "../../common/repository/RepositoryError";
import { FacadeOutput } from "../../common/contract/FacadeOutput";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

const repositoryErrorToUserError = (
    repositoryError: RE.RepositoryError<U.UserId>,
) => {
    if (RE.isRepositoryNotFoundError(repositoryError, U.userId.type)) {
        return UE.userNotFoundError(repositoryError.id, O.none);
    }
    return UE.userInternalError(repositoryError.id, O.none);
};

const noIdsInListError = () =>
    UE.userBadRequestError(O.none, "No user IDs provided.");

const missingIds = (ids: U.UserId[]) => UE.usersNotFoundError();

export class UserDomain implements UserFacade {
    constructor(private repository: UserRepository) {}

    create(input: U.CreateUserInput): TE.TaskEither<UE.UserError, U.User> {
        const timestamp = new Date();
        const user: U.User = {
            id: U.generateUserId(),
            name: input.name,
            username: input.name,
            email: input.email,
            created: timestamp,
            updated: timestamp,
        };
        return this.callRepository(this.repository.saveNewUser(user));
    }

    getFromContext(context: U.UserContext): FacadeOutput<U.User> {
        return this.callRepository(this.repository.find(context.userId));
    }

    getByIds(ids: U.UserId[]): FacadeOutput<U.User[]> {
        return pipe(
            TE.Do,
            TE.bind("nonEmptyIds", () =>
                TE.fromOption(noIdsInListError)(NEA.fromArray(ids)),
            ),
            TE.bind("users", ({ nonEmptyIds }) =>
                this.callRepository(this.repository.findByIds(nonEmptyIds)),
            ),
            TE.chain(({ nonEmptyIds, users }) => {
                if (nonEmptyIds.length === users.length) {
                    return TE.right(users);
                }
                const foundIds = users.map((user) => user.id);
                const missingIds = nonEmptyIds.filter(
                    (id) => !foundIds.includes(id),
                );
            }),
        );
    }

    delete(context: U.UserContext): FacadeOutput<void> {
        return this.callRepository(this.repository.delete(context.userId));
    }

    private callRepository<T>(operation: RepositoryOutput<U.UserId, T>) {
        return pipe(operation, TE.mapLeft(repositoryErrorToUserError));
    }
}
