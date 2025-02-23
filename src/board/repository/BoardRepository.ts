import * as NEA from "fp-ts/NonEmptyArray";
import { generateCursor, Repository } from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as B from "../types/Board";
import * as U from "../../user/types/User";
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

export const getId = (board: B.Board): B.BoardId => board.id;

export const getCursor = generateCursor<B.Board>(
    (board) => [board.id, board.updated] as NEA.NonEmptyArray<string>,
);
