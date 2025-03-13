import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { pipe } from "fp-ts/function";
import nodeSchedule from "node-schedule";
import { Event } from "../event/Event";
import { EventOutput } from "../event/EventOutput";
import { PaginatedRepository } from "../repository/PaginatedRepository";
import { RepositoryOutput } from "../repository/RepositoryOutput";
import { RepositoryError } from "../repository/RepositoryError";
import { FacadeError } from "../facade/FacadeError";

export class OutboxHandler<ID, T, E extends Event<T>> {
    jobs: nodeSchedule.Job[] = [];

    constructor(
        private repository: PaginatedRepository<ID, E>,
        private getId: (event: E) => ID,
        private repositoryErrorHandler: (
            error: RepositoryError<ID>,
        ) => FacadeError<ID>,
    ) {}

    startHandler(handler: (event: E) => EventOutput) {
        // TODO determine cron
        // TODO add locking
        const job = nodeSchedule.scheduleJob(
            "0 0 * * *",
            this.processEvents(handler),
        );
        this.jobs.push(job);
    }

    private processEvents(handler: (event: E) => EventOutput) {
        return pipe(
            this.callRepository(
                this.repository.list({
                    first: 100,
                    cursor: O.none,
                }),
            ),
            TE.chain((events) =>
                TE.sequenceSeqArray(
                    events.map((event) => this.processEvent(event, handler)),
                ),
            ),
        );
    }

    private processEvent(event: E, handler: (event: E) => EventOutput) {
        return pipe(
            handler(event),
            TE.chain(() =>
                this.callRepository(this.repository.delete(this.getId(event))),
            ),
        );
    }

    private callRepository<U>(output: RepositoryOutput<ID, U>) {
        return pipe(output, TE.mapLeft(this.repositoryErrorHandler));
    }
}
