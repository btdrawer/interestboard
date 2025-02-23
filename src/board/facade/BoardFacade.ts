import { FacadeOutput } from "../../common/facade/FacadeOutput";
import * as B from "../types/Board";

export interface BoardFacade {
    create(input: B.CreateBoardInput): FacadeOutput<B.Board>;

    update(input: B.UpdateBoardInput): FacadeOutput<B.Board>;

    subscribe(input: B.SubscribeToBoardInput): FacadeOutput<void>;

    unsubscribe(input: B.UnsubscribeFromBoardInput): FacadeOutput<void>;

    get(id: B.BoardId): FacadeOutput<B.Board>;
}
