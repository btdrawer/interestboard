import * as P from "../contract/Post";
import * as B from "../../board/contract/Board";
import * as U from "../../user/contract/User";
import { Repository } from "../../common/repository/Repository";
import {
    PaginatedRepository,
    PaginationOptions,
} from "../../common/repository/PaginatedRepository";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type PostRepository = Repository<P.PostId, P.Post> &
    PaginatedRepository<P.PostId, P.PostCursor, P.Post> & {
        findByBoardId(
            boardId: B.BoardId,
            paginationOptions: PaginationOptions<P.PostCursor>,
        ): RepositoryOutput<P.PostId, P.Post[]>;

        findByUserId(
            userId: U.UserId,
            paginationOptions: PaginationOptions<P.PostCursor>,
        ): RepositoryOutput<P.PostId, P.Post[]>;
    };
