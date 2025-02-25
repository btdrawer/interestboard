import { FacadeOutput } from "../../common/facade/FacadeOutput";
import * as S from "../types/Subscription";
import * as SI from "../types/SubscriptionInput";

export interface SubscriptionFacade {
    listSubscriptionsByBoard(
        input: SI.ListSubscriptionsByBoardInput,
    ): FacadeOutput<S.BoardSubscription[]>;

    listSubscriptionsByUser(
        input: SI.ListSubscriptionsByUserInput,
    ): FacadeOutput<S.BoardSubscription[]>;

    subscribe(
        input: SI.SubscribeToBoardInput,
    ): FacadeOutput<S.BoardSubscription>;

    unsubscribe(input: SI.UnsubscribeFromBoardInput): FacadeOutput<void>;
}
