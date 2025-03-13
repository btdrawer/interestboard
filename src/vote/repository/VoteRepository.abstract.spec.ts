import { paginatedRepositoryTest } from "../../common/repository/PaginatedRepository.abstract.spec";
import { repositoryTest } from "../../common/repository/Repository.abstract.spec";
import { userEntityFactory } from "./UserEntityFactory.util.spec";
import * as UR from "./UserRepository";

export const userRepositoryTest = (repositoryF: () => UR.UserRepository) => {
    repositoryTest(repositoryF, userEntityFactory);
    paginatedRepositoryTest(repositoryF, userEntityFactory);
};
