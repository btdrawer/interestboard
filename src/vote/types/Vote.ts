import * as t from "io-ts";
import * as td from "io-ts-types";
import * as U from "../../user/types/User";
import * as P from "../../post/types/Post";
import * as C from "../../comment/types/Comment";
import { getCompositeId } from "../../common/types/getCompositeId";

export const voteId = td.UUID;

export enum VoteRecordType {
    Post = "Post",
    Comment = "Comment",
}

export const voteRecordType = t.union([
    t.literal(VoteRecordType.Post),
    t.literal(VoteRecordType.Comment),
]);

export const postVoteRecord = t.type({
    type: t.literal(VoteRecordType.Post),
    id: P.postId,
});

export const commentVoteRecord = t.type({
    type: t.literal(VoteRecordType.Comment),
    id: C.commentId,
    postId: P.postId,
});

export const voteRecord = t.union([postVoteRecord, commentVoteRecord]);

export enum VoteType {
    Up = "Up",
    Down = "Down",
}

export const voteType = t.union([
    t.literal(VoteType.Up),
    t.literal(VoteType.Down),
]);

export const vote = t.type({
    id: voteId,
    userId: U.userId,
    record: voteRecord,
    type: voteType,
});

export type PostVoteRecord = t.TypeOf<typeof postVoteRecord>;
export type CommentVoteRecord = t.TypeOf<typeof commentVoteRecord>;
export type VoteRecord = t.TypeOf<typeof voteRecord>;

export type VoteId = t.TypeOf<typeof voteId>;
export type Vote = t.TypeOf<typeof vote>;

export const generateVoteRecordId = <ID>(
    userId: U.UserId,
    recordType: string,
    recordId: string,
) => getCompositeId([userId, recordType, recordId]);
