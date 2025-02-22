import * as NEA from "fp-ts/NonEmptyArray";
import { Repository } from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as U from "../contract/User";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type UserRepository = Repository<U.UserId, U.User> &
    PaginatedRepository<U.UserId, U.UserCursor, U.User> & {
        saveNewUser(user: U.User): RepositoryOutput<U.UserId, U.User>;

        findByIds(
            ids: NEA.NonEmptyArray<U.UserId>,
        ): RepositoryOutput<U.UserId, U.User[]>;
    };
