import { InMemoryUsersRepository } from "../../../../users/repositories/in-memory/InMemoryUsersRepository";
import { OperationType } from "../../../entities/Statement";
import { InMemoryStatementsRepository } from "../../../repositories/in-memory/InMemoryStatementsRepository";
import { GetBalanceError } from "../GetBalanceError";
import { GetBalanceUseCase } from "../GetBalanceUseCase";

let iStatementsRepository: InMemoryStatementsRepository;
let userRepository: InMemoryUsersRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Create Statement", () => {
  beforeEach(() => {
    iStatementsRepository = new InMemoryStatementsRepository();
    userRepository = new InMemoryUsersRepository();
    getBalanceUseCase = new GetBalanceUseCase(
      iStatementsRepository,
      userRepository
    );
  });

  it("Should be able to show a balance by user id", async () => {
    const user = await userRepository.create({
      name: "challenge test",
      email: "challenge@email.com",
      password: "aoba",
    });

    await iStatementsRepository.create({
      amount: 200,
      description: "deposito test",
      type: OperationType.DEPOSIT,
      user_id: user.id as string,
    });

    await iStatementsRepository.create({
      amount: 100,
      description: "withdraw test",
      type: OperationType.WITHDRAW,
      user_id: user.id as string,
    });

    const response = await getBalanceUseCase.execute({
      user_id: user.id as string,
    });

    expect(response.statement.length).toBe(2);
    expect(response.balance).toBe(100);
  });

  it("Should be not able to balance by user id", async () => {
    expect(async () => {
      const user = await userRepository.create({
        name: "challenge test",
        email: "challenge@email.com",
        password: "aoba",
      });

      await iStatementsRepository.create({
        amount: 200,
        description: "deposito test",
        type: OperationType.DEPOSIT,
        user_id: user.id as string,
      });

      const response = await getBalanceUseCase.execute({
        user_id: "12345",
      });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
