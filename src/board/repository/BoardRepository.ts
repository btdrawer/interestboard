import { Repository } from "../../common/repository/Repository";
import { PaginatedRepository } from "../../common/repository/PaginatedRepository";
import * as B from "../contract/Board";

export type BoardRepository = Repository<B.BoardId, B.Board> &
    PaginatedRepository<B.BoardId, B.BoardCursor, B.Board>;
