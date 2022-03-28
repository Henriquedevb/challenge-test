import { InMemoryUsersRepository } from "../../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "../../authenticateUser/AuthenticateUserUseCase";
import { CreateUserUseCase } from "../../createUser/CreateUserUseCase";
import { ShowUserProfileUseCase } from "../ShowUserProfileUseCase";

let createUserUseCase: CreateUserUseCase;
let showProfileUserUseCase: ShowUserProfileUseCase;
let inMemoryUserRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe("List cars", () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUsersRepository();

    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository
    );
    createUserUseCase = new CreateUserUseCase(inMemoryUserRepository);
    showProfileUserUseCase = new ShowUserProfileUseCase(inMemoryUserRepository);
  });

  it("Should be able to list profile user", async () => {
    const user = await createUserUseCase.execute({
      name: "challenge test",
      email: "challenge@email.com",
      password: "aoba",
    });

    const userAuth = await authenticateUserUseCase.execute({
      email: user.email,
      password: "aoba",
    });

    const { id } = userAuth.user;

    const userProfile = await showProfileUserUseCase.execute(id as string);

    expect(userAuth).toHaveProperty(["token"]);
    expect(userProfile).toMatchObject(user);
  });
});
