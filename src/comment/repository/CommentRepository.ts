import { Repository } from "../../common/repository/Repository";
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
