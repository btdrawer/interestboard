import * as TE from "fp-ts/TaskEither";
import * as U from "../contract/User";
import * as UE from "../contract/UserError";
import { UserFacade } from "../contract/UserFacade";

export class UserDomain implements UserFacade {
    create(username: string): TE.TaskEither<UE.UserError, U.User> {
        throw new Error("Method not implemented.");
    }

    delete(id: U.UserId): TE.TaskEither<UE.UserError, void> {
        throw new Error("Method not implemented.");
    }
}
