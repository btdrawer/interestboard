import * as NEA from "fp-ts/NonEmptyArray";
import * as R from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as U from "../types/User";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type UserRepository = R.Repository<U.UserId, U.User> &
    PaginatedRepository<U.UserId, U.UserCursor, U.User> & {
        saveNewUser(user: U.User): RepositoryOutput<U.UserId, U.User>;

        findByIds(
            ids: NEA.NonEmptyArray<U.UserId>,
        ): RepositoryOutput<U.UserId, U.User[]>;
    };

export const getId = (user: U.User): U.UserId => user.id;

export const getCursor = R.generateCursor<U.User>(
    (user) =>
        [
            user.id.toString(),
            user.updated.toISOString(),
        ] as NEA.NonEmptyArray<string>,
);
