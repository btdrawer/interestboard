import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import * as NEA from "fp-ts/NonEmptyArray";
import { pipe } from "fp-ts/function";
import * as U from "../../user/types/User";
import * as B from "../types/Board";
import * as BI from "../types/BoardInput";
import * as BE from "../types/BoardError";
import { BoardFacade } from "../facade/BoardFacade";
import { UserFacade } from "../../user/facade/UserFacade";
import * as SUE from "../../subscription/event/SubscriptionUpdatedEvent";
import { BoardRepository } from "../repository/BoardRepository";
import { FacadeOutput } from "../../common/facade/FacadeOutput";
import {
    isRepositoryNotFoundError,
    RepositoryError,
} from "../../common/repository/RepositoryError";
import { EventBus } from "../../common/event/EventBus";

export const repositoryErrorToBoardError = (
    repositoryError: RepositoryError<B.BoardId>,
): BE.BoardError => {
    if (isRepositoryNotFoundError(repositoryError, B.boardId.type)) {
        return BE.boardNotFoundError(repositoryError.ids, O.none);
    }
    return BE.boardInternalError(repositoryError.ids, O.none);
};

const notAModeratorError = (id: B.BoardId) =>
    BE.boardForbiddenError(
        [id],
        "You cannot update this board because you are not a moderator.",
    );

const noModeratorsLeftError = (id: B.BoardId) =>
    BE.boardBadRequestError(
        [id],
        "You cannot remove the last moderator from a board.",
    );

export class BoardDomain implements BoardFacade {
    constructor(
        private repository: BoardRepository,
        private userFacade: UserFacade,
        private subscriptionUpdatedEventBus: EventBus<
            SUE.SubscriptionUpdatedEventBody,
            SUE.SubscriptionUpdatedEvent
        >,
    ) {
        this.subscriptionUpdatedEventBus.addListener((event) => {
            if (event.body.type === SUE.SubscriptionUpdateType.Add) {
                this.repository.addSubscriber(event.body.boardId)();
            } else {
                this.repository.removeSubscriber(event.body.boardId)();
            }
        });
    }

    create(input: BI.CreateBoardInput): FacadeOutput<B.Board> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.map((user) => {
                const timestamp = new Date();
                return {
                    id: B.generateBoardId(),
                    name: input.name,
                    title: input.title,
                    description: input.description,
                    moderators: [user.id] as NEA.NonEmptyArray<U.UserId>,
                    subscribers: 1,
                    locked: false,
                    created: timestamp,
                    updated: timestamp,
                };
            }),
            TE.chain((board) =>
                this.callRepository(this.repository.save(board)),
            ),
        );
    }

    get(id: B.BoardId): FacadeOutput<B.Board> {
        return this.callRepository(this.repository.find(id));
    }

    update(input: BI.UpdateBoardInput): FacadeOutput<B.Board> {
        return pipe(
            TE.Do,
            TE.chain(() => this.userFacade.getFromContext(input.context)),
            TE.bind("board", () =>
                this.callRepository(this.repository.find(input.id)),
            ),
            TE.bind("validate", ({ board }) =>
                this.validateUpdate(input, board),
            ),
            TE.bind("moderators", ({ board }) => {
                const newModerators = NEA.fromArray([
                    ...board.moderators.filter(
                        (m) => !input.moderators.remove.includes(m),
                    ),
                    ...input.moderators.add,
                ]);
                return O.fold<
                    NEA.NonEmptyArray<U.UserId>,
                    FacadeOutput<NEA.NonEmptyArray<U.UserId>>
                >(
                    () => TE.left(noModeratorsLeftError(input.id)),
                    (moderators) => TE.right(moderators),
                )(newModerators);
            }),
            TE.map(({ board, moderators }) => ({
                ...board,
                name: input.name,
                title: input.title,
                description: input.description,
                moderators,
                locked: input.locked,
                updated: new Date(),
            })),
            TE.chain((updatedBoard) =>
                this.callRepository(this.repository.save(updatedBoard)),
            ),
        );
    }

    private validateUpdate(
        input: BI.UpdateBoardInput,
        board: B.Board,
    ): FacadeOutput<void> {
        return pipe(
            TE.Do,
            TE.chain(() => {
                if (!board.moderators.includes(input.context.userId)) {
                    return TE.left(notAModeratorError(input.id));
                }
                return TE.right(board);
            }),
            TE.chain(() =>
                this.userFacade.getByIds([
                    // validate all moderators exist
                    ...input.moderators.add,
                    ...input.moderators.remove,
                ]),
            ),
            TE.map(() => undefined),
        );
    }

    private callRepository<T>(
        operation: TE.TaskEither<RepositoryError<B.BoardId>, T>,
    ) {
        return pipe(operation, TE.mapLeft(repositoryErrorToBoardError));
    }
}
