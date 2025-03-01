import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";
import { generateCursor, Repository } from "../../common/repository/Repository";
import {
    PaginatedRepository,
    PaginationOptions,
} from "../../common/repository/PaginatedRepository";
import * as T from "../types/Thread";
import * as U from "../../user/types/User";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type ThreadRepository = Repository<T.ThreadId, T.Thread> &
    PaginatedRepository<T.ThreadId, T.ThreadCursor, T.Thread> & {
        listByParentId: (
            parentId: O.Option<T.ThreadId>,
            pagination: PaginationOptions<T.ThreadCursor>,
        ) => RepositoryOutput<T.ThreadId, T.Thread[]>;

        listByUserId: (
            userId: U.UserId,
            pagination: PaginationOptions<T.ThreadCursor>,
        ) => RepositoryOutput<T.ThreadId, T.Thread[]>;
    };

export const getId = (comment: T.Thread): T.ThreadId => comment.id;

export const getCursor = generateCursor<T.Thread>(
    (comment) =>
        [
            comment.id.toString(),
            comment.updated.toISOString(),
        ] as NEA.NonEmptyArray<string>,
);
