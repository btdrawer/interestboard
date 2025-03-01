import * as T from "../types/Thread";
import * as TI from "../types/ThreadInput";
import { FacadeOutput } from "../../common/facade/FacadeOutput";

export interface ThreadFacade {
    create(input: TI.CreateThreadInput): FacadeOutput<T.Thread>;

    listByParent(input: TI.ListThreadsByParent): FacadeOutput<T.Thread[]>;

    listByUser(input: TI.ListThreadsByUser): FacadeOutput<T.Thread[]>;

    delete(input: TI.DeleteThreadInput): FacadeOutput<void>;
}
