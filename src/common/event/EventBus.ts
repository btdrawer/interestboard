import * as TE from "fp-ts/TaskEither";
import { pipe } from "fp-ts/function";
import { Event } from "./Event";
import { EventOutput } from "./EventOutput";

export class EventBus<T, E extends Event<T>> {
    private listeners: Array<(event: E) => EventOutput> = [];

    public addListener(listener: (event: E) => EventOutput) {
        this.listeners.push(listener);
    }

    public removeListener(listener: (event: E) => void) {
        this.listeners = this.listeners.filter((l) => l !== listener);
    }

    public dispatch(event: E): EventOutput {
        return pipe(
            TE.sequenceSeqArray(
                this.listeners.map((listener) => listener(event)),
            ),
            TE.map(() => undefined),
        );
    }
}
