import * as V from "../types/Vote";
import * as U from "../../user/types/User";
import * as T from "../../thread/types/Thread";
import { Repository } from "../../common/repository/Repository";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type VoteRepository = Repository<V.VoteId, V.Vote> & {
    listVotesByUserIdAndThreadId(
        userId: U.UserId,
        threadId: T.ThreadId,
    ): RepositoryOutput<V.VoteId, V.Vote[]>;
};
