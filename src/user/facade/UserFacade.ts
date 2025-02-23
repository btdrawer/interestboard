import * as U from "../types/User";
import { FacadeOutput } from "../../common/facade/FacadeOutput";

export interface UserFacade {
    create(input: U.CreateUserInput): FacadeOutput<U.User>;

    getFromContext(context: U.UserContext): FacadeOutput<U.User>;

    getByIds(ids: U.UserId[]): FacadeOutput<U.User[]>;

    delete(context: U.UserContext): FacadeOutput<void>;
}
