import * as t from "io-ts";
import { FakePaginatedRepository } from "../../../../common/repository/adapters/fake/FakePaginatedRepository";
import { PaginationOptions } from "../../../../common/repository/PaginatedRepository";
import { RepositoryOutput } from "../../../../common/repository/RepositoryOutput";
import { PostId } from "../../../../post/types/Post";
import * as C from "../../../types/Comment";
import * as CR from "../../CommentRepository";
import { UserId } from "../../../../user/types/User";

export class CommentFakeRepository
    extends FakePaginatedRepository<C.CommentId, C.CommentCursor, C.Comment>
    implements CR.CommentRepository
{
    constructor() {
        super(
            C.commentId.type as unknown as t.Type<C.CommentId>, // TODO: Fix io-ts types
            CR.getId,
            CR.getCursor,
        );
    }

    listByPostId(
        postId: PostId,
        pagination: PaginationOptions<C.CommentCursor>,
    ): RepositoryOutput<C.CommentId, C.Comment[]> {
        return this.listWithFilter((c) => c.postId === postId)(pagination);
    }

    listByUserId(
        userId: UserId,
        pagination: PaginationOptions<C.CommentCursor>,
    ): RepositoryOutput<C.CommentId, C.Comment[]> {
        return this.listWithFilter((c) => c.authorId === userId)(pagination);
    }
}
