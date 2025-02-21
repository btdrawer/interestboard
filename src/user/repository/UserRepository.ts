import { Repository } from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as U from "../contract/User";

export type UserRepository = Repository<U.UserId, U.User> &
    PaginatedRepository<U.UserId, U.UserCursor, U.User>;
