import * as C from "../../../types/Comment";
import { CommentFakeRepository } from "./CommentFakeRepository";
import { commentEntityFactory } from "../../CommentEntityFactory.util.spec";
import { repositoryTest } from "../../../../common/repository/Repository.abstract.spec";

describe("CommentFakeRepository", () => {
    repositoryTest<C.CommentId, C.Comment>(
        new CommentFakeRepository(),
        commentEntityFactory,
    );
});
