import * as C from "../types/Comment";
import { FacadeOutput } from "../../common/facade/FacadeOutput";

export interface CommentFacade {
    create(input: C.CreateCommentInput): FacadeOutput<C.Comment>;

    listByPost(input: C.ListCommentsByPost): FacadeOutput<C.Comment[]>;

    listByUser(input: C.ListCommentsByUser): FacadeOutput<C.Comment[]>;

    delete(input: C.DeleteCommentInput): FacadeOutput<void>;
}
