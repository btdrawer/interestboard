import { Repository } from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as B from "../contract/Board";
import * as U from "../../user/contract/User";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type BoardRepository = Repository<B.BoardId, B.Board> &
    PaginatedRepository<B.BoardId, B.BoardCursor, B.Board> & {
        listSubscribers(id: B.BoardId): RepositoryOutput<B.BoardId, U.UserId[]>; // TODO pagination

        subscribe(
            id: B.BoardId,
            userId: U.UserId,
        ): RepositoryOutput<B.BoardId, void>;

        unsubscribe(
            id: B.BoardId,
            userId: U.UserId,
        ): RepositoryOutput<B.BoardId, void>;
    };
