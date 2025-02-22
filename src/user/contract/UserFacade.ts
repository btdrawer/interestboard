import * as U from "./User";
import { FacadeOutput } from "../../common/contract/FacadeOutput";

export interface UserFacade {
    create(username: string): FacadeOutput<U.User>;

    getFromContext(context: U.UserContext): FacadeOutput<U.User>;

    getByIds(ids: U.UserId[]): FacadeOutput<U.User[]>;

    delete(id: U.UserId): FacadeOutput<void>;
}
