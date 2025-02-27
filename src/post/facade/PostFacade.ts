import * as P from "../types/Post";
import * as PI from "../types/PostInput";
import { FacadeOutput } from "../../common/facade/FacadeOutput";

export interface PostFacade {
    create(input: PI.CreatePostInput): FacadeOutput<P.Post>;

    get(input: PI.GetPostInput): FacadeOutput<P.Post>;

    listByBoard(input: PI.ListPostsByBoardInput): FacadeOutput<P.Post[]>;

    listByUser(input: PI.ListPostsByUserInput): FacadeOutput<P.Post[]>;

    delete(context: PI.DeletePostInput): FacadeOutput<void>;
}
