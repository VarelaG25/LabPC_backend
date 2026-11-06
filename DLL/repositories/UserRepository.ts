import type { IUserRepository } from '../../Application';
import { User } from '../../Domain';
import type { IDataContext } from '../context/IDataContext';

export class UserRepository implements IUserRepository {
  constructor(private readonly context: IDataContext<User>) {}

  async findAll(): Promise<User[]> {
    const users = await this.context.find();
    return users.filter((user) => user.changeControl?.eliminated !== 1);
  }

  async findById(id: number): Promise<User | null> {
    return this.context.findOne({ id });
  }

  async findByUsername(username: string): Promise<User | null> {
    const normalizedUsername = username.trim().toLowerCase();
    const users = await this.context.find();
    return (
      users.find(
        (user) =>
          user.email?.toLowerCase() === normalizedUsername ||
          user.name?.toLowerCase() === normalizedUsername,
      ) ?? null
    );
  }

  async findByEmail(email: string): Promise<User | null> {
    const normalizedEmail = email.trim().toLowerCase();
    const users = await this.context.find();
    return users.find((user) => user.email?.toLowerCase() === normalizedEmail) ?? null;
  }

  async create(user: User): Promise<User> {
    user.id = await this.context.nextId();
    return this.context.insertOne(user);
  }
}
