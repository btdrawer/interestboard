import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import * as U from "../contract/User";
import * as UE from "../contract/UserError";
import { UserFacade } from "../contract/UserFacade";
import { UserRepository } from "../repository/UserRepository";
import * as RE from "../../common/repository/RepositoryError";

const getUserErrorFromRepositoryError = (
    error: RE.RepositoryError<U.UserId>,
): UE.UserError => {
    if (RE.isEntityNotFoundError(error, U.userId.type)) {
        return UE.userNotFoundError(error.id, O.none);
    }
    if (RE.isRepositoryInternalError(error, U.userId.type)) {
        return UE.userInternalError(error.id, O.some(error.message));
    }
    return UE.userInternalError(O.none, O.none);
};

export class UserDomain implements UserFacade {
    constructor(private repository: UserRepository) {}

    create(username: string): TE.TaskEither<UE.UserError, U.User> {
        throw new Error("Method not implemented.");
    }

    getFromContext(
        context: U.UserContext,
    ): TE.TaskEither<UE.UserError, U.User> {
        return pipe(
            TE.Do,
            TE.chain(() => this.repository.find(context.userId)),
            TE.mapLeft(getUserErrorFromRepositoryError),
        );
    }

    delete(id: U.UserId): TE.TaskEither<UE.UserError, void> {
        throw new Error("Method not implemented.");
    }
}
