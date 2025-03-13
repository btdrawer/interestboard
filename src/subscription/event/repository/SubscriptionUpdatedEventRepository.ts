import * as S from "../../types/Subscription";
import * as SUE from "../SubscriptionUpdatedEvent";
import { Repository } from "../../../common/repository/Repository";
import { PaginatedRepository } from "../../../common/repository/PaginatedRepository";

export type SubscriptionUpdatedEventRepository = Repository<
    S.BoardSubscriptionId,
    SUE.SubscriptionUpdatedEvent
> &
    PaginatedRepository<S.BoardSubscriptionId, SUE.SubscriptionUpdatedEvent>;

export const getId = (
    event: SUE.SubscriptionUpdatedEvent,
): S.BoardSubscriptionId =>
    S.getBoardSubscriptionId(event.body.boardId, event.body.userId);
