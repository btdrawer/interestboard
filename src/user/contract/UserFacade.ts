import * as TE from "fp-ts/TaskEither";
import * as U from "./User";
import * as UE from "./UserError";

export interface UserFacade {
    create(username: string): TE.TaskEither<UE.UserError, U.User>;

    delete(id: U.UserId): TE.TaskEither<UE.UserError, void>;
}
