import * as NEA from "fp-ts/NonEmptyArray";
import { generateCursor, Repository } from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as B from "../types/Board";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type BoardRepository = Repository<B.BoardId, B.Board> &
    PaginatedRepository<B.BoardId, B.Board> & {
        addSubscriber(id: B.BoardId): RepositoryOutput<B.BoardId, B.Board>;

        removeSubscriber(id: B.BoardId): RepositoryOutput<B.BoardId, B.Board>;
    };

export const getId = (board: B.Board): B.BoardId => board.id;

export const getCursor = generateCursor<B.Board>(
    (board) => [board.id, board.updated] as NEA.NonEmptyArray<string>,
);
