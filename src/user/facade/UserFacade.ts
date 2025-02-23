import * as U from "../types/User";
import * as UI from "../types/UserInput";
import { FacadeOutput } from "../../common/facade/FacadeOutput";

export interface UserFacade {
    create(input: UI.CreateUserInput): FacadeOutput<U.User>;

    get(id: U.UserId): FacadeOutput<U.User>;

    getFromContext(context: U.UserContext): FacadeOutput<U.User>;

    getByIds(ids: U.UserId[]): FacadeOutput<U.User[]>;

    delete(context: U.UserContext): FacadeOutput<void>;
}
