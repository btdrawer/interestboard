import * as V from "../../types/Vote";
import * as VE from "../VoteEvent";
import { Repository } from "../../../common/repository/Repository";
import { PaginatedRepository } from "../../../common/repository/PaginatedRepository";

export type VoteEventRepository = Repository<V.VoteId, VE.VoteEvent> &
    PaginatedRepository<V.VoteId, VE.VoteEvent>;
