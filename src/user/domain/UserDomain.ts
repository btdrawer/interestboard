import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";
import * as U from "../types/User";
import * as UI from "../types/UserInput";
import * as UE from "../types/UserError";
import { UserFacade } from "../facade/UserFacade";
import { UserRepository } from "../repository/UserRepository";
import * as RE from "../../common/repository/RepositoryError";
import { FacadeOutput } from "../../common/facade/FacadeOutput";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

const repositoryErrorToUserError = (
    repositoryError: RE.RepositoryError<U.UserId>,
) => {
    if (RE.isRepositoryNotFoundError(repositoryError, U.userId.type)) {
        return UE.userNotFoundError(repositoryError.ids, O.none);
    }
    return UE.userInternalError(repositoryError.ids, O.none);
};

const noIdsInListError = () =>
    UE.userBadRequestError([], "No user IDs provided.");

const missingIdsError = (ids: U.UserId[]) => UE.usersNotFoundError(ids, O.none);

export class UserDomain implements UserFacade {
    constructor(private repository: UserRepository) {}

    create(input: UI.CreateUserInput): TE.TaskEither<UE.UserError, U.User> {
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

    get(id: U.UserId): FacadeOutput<U.User> {
        return this.callRepository(this.repository.find(id));
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
                return TE.left(missingIdsError(missingIds));
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
