import * as E from "fp-ts/Either";
import * as R from "./Repository";
import * as RE from "./RepositoryError";

export interface EntityFactory<ID, T> {
    newId: () => ID;
    newEntity: (id: ID) => T;
    updateEntity: (entity: T) => T;
}

export const repositoryTest = <ID, T>(
    repository: R.Repository<ID, T>,
    factory: EntityFactory<ID, T>,
) => {
    describe("Repository", () => {
        it("should save an entity", async () => {
            const entity = factory.newEntity(factory.newId());
            const saveResult = await repository.save(entity)();
            expect(saveResult).toEqual(E.right(entity));
        });

        it("should find an entity", async () => {
            const id = factory.newId();
            const entity = factory.newEntity(id);
            await repository.save(entity)();
            const findResult = await repository.find(id)();
            expect(findResult).toEqual(E.right(entity));
        });

        it("should return not found error if entity does not exist", async () => {
            const id = factory.newId();
            const findResult = await repository.find(id)();
            expect(findResult).toEqual(E.left(RE.entityNotFoundError(id)));
        });

        it("should delete an entity", async () => {
            const id = factory.newId();
            const entity = factory.newEntity(id);

            await repository.save(entity)();

            const findResultBeforeDeletion = await repository.find(id)();
            expect(findResultBeforeDeletion).toEqual(E.right(entity));

            const deleteResult = await repository.delete(id)();
            expect(deleteResult).toEqual(E.right(undefined));

            const findResultAfterDeletion = await repository.find(id)();
            expect(findResultAfterDeletion).toEqual(
                E.left(RE.entityNotFoundError(id)),
            );
        });
    });
};
