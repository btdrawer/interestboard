import { FacadeOutput } from "../../common/facade/FacadeOutput";
import * as B from "../types/Board";
import * as BI from "../types/BoardInput";

export interface BoardFacade {
    create(input: BI.CreateBoardInput): FacadeOutput<B.Board>;

    get(id: B.BoardId): FacadeOutput<B.Board>;

    update(input: BI.UpdateBoardInput): FacadeOutput<B.Board>;
}
