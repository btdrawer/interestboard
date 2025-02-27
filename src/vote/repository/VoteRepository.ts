import * as V from "../types/Vote";
import * as U from "../../user/types/User";
import * as P from "../../post/types/Post";
import { Repository } from "../../common/repository/Repository";
import { RepositoryOutput } from "../../common/repository/RepositoryOutput";

export type VoteRepository = Repository<V.VoteId, V.Vote> & {
    listVotesByUserIdAndPostId(
        userId: U.UserId,
        postId: P.PostId,
    ): RepositoryOutput<V.VoteId, V.Vote[]>;
};
