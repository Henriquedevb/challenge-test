import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../users/useCases/createUser/CreateUserUseCase";
import { OperationType } from "../../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementError } from "../CreateStatementError";
import { CreateStatementUseCase } from "../CreateStatementUseCase";

let iStatementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let userRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    iStatementsRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(userRepository);
    createStatementUseCase = new CreateStatementUseCase(
      userRepository,
      iStatementsRepository
    );
  });

  it("Should be able to create statement correctly", async () => {
    const user = await createUserUseCase.execute({
      name: "challenge test",
      email: "challenge@email.com",
      password: "aoba",
    });

    const statement = await createStatementUseCase.execute({
      amount: 2000,
      description: "teste",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    expect(statement).toHaveProperty("id");
  });

  it("Should not be able to create statement from user incorrectly", async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "challenge test",
        email: "challenge@email.com",
        password: "aoba",
      });

      await createStatementUseCase.execute({
        amount: 2000,
        description: "teste",
        type: OperationType.DEPOSIT,
        user_id: "1234",
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it("Should not be possible to make a withdraw with insufficient balance  ", async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: "challenge test",
        email: "challenge@email.com",
        password: "aoba",
      });

      await createStatementUseCase.execute({
        amount: 1000,
        description: "teste",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      await createStatementUseCase.execute({
        amount: 2000,
        description: "teste",
        type: OperationType.WITHDRAW,
        user_id: user.id as string,
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
