import * as C from "../types/Comment";
import * as CI from "../types/CommentInput";
import { FacadeOutput } from "../../common/facade/FacadeOutput";

export interface CommentFacade {
    create(input: CI.CreateCommentInput): FacadeOutput<C.Comment>;

    listByPost(input: CI.ListCommentsByPost): FacadeOutput<C.Comment[]>;

    listByUser(input: CI.ListCommentsByUser): FacadeOutput<C.Comment[]>;

    delete(input: CI.DeleteCommentInput): FacadeOutput<void>;
}
