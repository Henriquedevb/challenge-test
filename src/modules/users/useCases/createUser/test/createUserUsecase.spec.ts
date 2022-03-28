import { AppError } from "../../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "../CreateUserError";
import { CreateUserUseCase } from "../CreateUserUseCase";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create User", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able top create new user correctly", async () => {
    const user = await createUserUseCase.execute({
      name: "challenge test",
      email: "challenge@email.com",
      password: "aoba",
    });

    expect(user).toHaveProperty("id");
  });

  it("Should not be able to create user already exists", () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: "challenge test one",
        email: "challenge@email.com",
        password: "aoba",
      });

      await createUserUseCase.execute({
        name: "challenge test two",
        email: "challenge@email.com",
        password: "aoba",
      });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
