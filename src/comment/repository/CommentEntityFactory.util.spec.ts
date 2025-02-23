import * as O from "fp-ts/Option";
import * as C from "../types/Comment";
import * as P from "../../post/types/Post";
import * as U from "../../user/types/User";
import { EntityFactory } from "../../common/repository/Repository.abstract.spec";

export const commentEntityFactory: EntityFactory<C.CommentId, C.Comment> = {
    newId: () => C.generateCommentId(),
    newEntity: (id: C.CommentId) => ({
        id,
        postId: P.generatePostId(),
        authorId: U.generateUserId(),
        parentId: O.none,
        body: "Hello, world!",
        upvotes: 0,
        downvotes: 0,
        created: new Date(),
        updated: new Date(),
        deleted: O.none,
    }),
    updateEntity: (entity: C.Comment) => ({
        ...entity,
        body: "Hello, universe!",
        updated: new Date(),
    }),
};
