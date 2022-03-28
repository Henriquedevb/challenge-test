import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { GetStatementOperationError } from "../GetStatementOperationError";
import { GetStatementOperationUseCase } from "../GetStatementOperationUseCase";

let getStatementOperationUseCase: GetStatementOperationUseCase;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Get Statement Operation", () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    inMemoryUsersRepository = new InMemoryUsersRepository();
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    );
  });

  it("should be able to show a statement operation by user id", async () => {
    const user = await inMemoryUsersRepository.create({
      name: "user teste",
      email: "userteste@mail.com",
      password: "123",
    });

    const deposit = await inMemoryStatementsRepository.create({
      user_id: user.id as string,
      type: OperationType.DEPOSIT,
      amount: 10000,
      description: "Desenvolvimento de uma aplicação",
    });

    const response = await getStatementOperationUseCase.execute({
      user_id: user.id as string,
      statement_id: deposit.id as string,
    });

    expect(response).toHaveProperty("id");
    expect(response).toHaveProperty("type");
  });

  it("should not be able to show a statement operation with nonexistent user", () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({
        user_id: "1234",
        statement_id: "123456",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it("should not be able to show a statement operation with nonexistent statement", () => {
    expect(async () => {
      const user = await inMemoryUsersRepository.create({
        name: "user teste",
        email: "userteste@mail.com",
        password: "123",
      });

      await getStatementOperationUseCase.execute({
        user_id: user.id as string,
        statement_id: "123456",
      });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
