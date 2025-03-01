import { FacadeOutput } from "../../common/facade/FacadeOutput";
import * as V from "../types/Vote";
import * as VI from "../types/VoteInput";

export interface VoteFacade {
    vote(input: VI.VoteInput): FacadeOutput<V.Vote>;

    listUserVotesByThread(
        input: VI.ListUserVotesByThreadInput,
    ): FacadeOutput<V.Vote[]>;

    unvote(input: VI.UnvoteInput): FacadeOutput<void>;
}
