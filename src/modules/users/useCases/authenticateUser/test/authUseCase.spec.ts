import { AppError } from "../../../../../shared/errors/AppError";
import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "../AuthenticateUserUseCase";

let authenticateUseCase: AuthenticateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Authenticate user", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    authenticateUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("Should be able authenticate user", async () => {
    const user: ICreateUserDTO = {
      name: "challenge",
      email: "challenge@email.com",
      password: "123456",
    };

    await createUserUseCase.execute(user);

    const authUser = await authenticateUseCase.execute({
      email: "challenge@email.com",
      password: "123456",
    });

    expect(authUser).toHaveProperty("token");
  });

  it("Should not be able to authenticate an nonexistent user ", async () => {
    expect(async () => {
      await authenticateUseCase.execute({
        email: "challenge@email.com.br",
        password: "123456",
      });
    }).rejects.toBeInstanceOf(AppError);
  });

  it("should not be able to authenticate with incorrect password ", () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        email: "user@spec.test",
        name: "User Spec",
        password: "123456",
      };

      await createUserUseCase.execute(user);

      await authenticateUseCase.execute({
        email: user.email,
        password: "aoba",
      });
    }).rejects.toBeInstanceOf(AppError);
  });
});
