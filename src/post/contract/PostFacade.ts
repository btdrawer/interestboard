import * as P from "./Post";
import { FacadeOutput } from "../../common/contract/FacadeOutput";

export interface PostFacade {
    create(input: P.CreatePostInput): FacadeOutput<P.Post>;

    vote(input: P.VoteInput): FacadeOutput<void>;

    listByBoard(input: P.ListPostsByBoardInput): FacadeOutput<P.Post[]>;

    listByUser(input: P.ListPostsByUserInput): FacadeOutput<P.Post[]>;

    delete(context: P.DeletePostInput): FacadeOutput<void>;
}
