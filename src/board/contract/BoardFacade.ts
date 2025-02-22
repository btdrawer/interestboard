import * as TE from "fp-ts/TaskEither";
import { FacadeOutput } from "../../common/contract/FacadeOutput";
import * as B from "./Board";
import * as BE from "./BoardError";

export interface BoardFacade {
    create(input: B.CreateBoardInput): FacadeOutput<B.Board>;

    update(input: B.UpdateBoardInput): FacadeOutput<B.Board>;

    subscribe(input: B.SubscribeToBoardInput): FacadeOutput<void>;

    unsubscribe(input: B.UnsubscribeFromBoardInput): FacadeOutput<void>;

    lock(input: B.LockBoardInput): FacadeOutput<void>;
}
