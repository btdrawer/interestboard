import * as NEA from "fp-ts/NonEmptyArray";
import { generateCursor, Repository } from "../../common/repository/Repository";
import {
    PaginatedRepository,
    PaginationOptions,
} from "../../common/repository/PaginatedRepository";
import * as C from "../types/Comment";
import * as P from "../../post/types/Post";
import * as U from "../../user/types/User";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type CommentRepository = Repository<C.CommentId, C.Comment> &
    PaginatedRepository<C.CommentId, C.CommentCursor, C.Comment> & {
        listByPostId: (
            postId: P.PostId,
            pagination: PaginationOptions<C.CommentCursor>,
        ) => RepositoryOutput<C.CommentId, C.Comment[]>;

        listByUserId: (
            userId: U.UserId,
            pagination: PaginationOptions<C.CommentCursor>,
        ) => RepositoryOutput<C.CommentId, C.Comment[]>;
    };

export const getId = (comment: C.Comment): C.CommentId => comment.id;

export const getCursor = generateCursor<C.Comment>(
    (comment) =>
        [
            comment.id.toString(),
            comment.updated.toISOString(),
        ] as NEA.NonEmptyArray<string>,
);
