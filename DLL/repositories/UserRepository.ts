import type { IUserRepository } from '../../Application';
import { User } from '../../Domain';
import type { IDataContext } from '../context/IDataContext';

export class UserRepository implements IUserRepository {
  constructor(private readonly context: IDataContext<User>) {}

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
}
