import * as TE from "fp-ts/TaskEither";
import * as O from "fp-ts/Option";
import { PaginatedRepository } from "./PaginatedRepository";
import { EntityFactory } from "./Repository.abstract.spec";

export interface PaginatedEntityFactory<ID, T> extends EntityFactory<ID, T> {
    getId(entity: T): ID;
    getCursor(entity: T): string;
}

export const paginatedRepositoryTest = <ID, T>(
    paginatedRepositoryF: () => PaginatedRepository<ID, T>,
    factory: PaginatedEntityFactory<ID, T>,
) => {
    const repository = paginatedRepositoryF();

    const entities = Array.from({ length: 20 }, () =>
        factory.newEntity(factory.newId()),
    );

    beforeAll(async () => {
        await TE.sequenceSeqArray(entities.map(repository.save))();
    });

    afterAll(async () => {
        await TE.sequenceSeqArray(
            entities.map((entity) => repository.delete(factory.getId(entity))),
        )();
    });

    describe("PaginatedRepository", () => {
        it("should return the first page of results", async () => {
            const result = await repository.list({
                first: 10,
                cursor: O.none,
            })();

            expect(result).toEqual(entities.slice(0, 10));
        });

        it("should return the second page of results", async () => {
            const result = await repository.list({
                first: 10,
                cursor: O.some(factory.getCursor(entities[9])),
            })();

            expect(result).toEqual(entities.slice(10, 20));
        });
    });
};
