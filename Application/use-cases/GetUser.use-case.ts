import type { IAuthenticationService } from '../interfaces/IAuthenticationService';
import type { UserDto } from '../dtos/User.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class GetUserUseCase {
  constructor(private readonly authenticationService: IAuthenticationService) {}

  async execute(userId: number): Promise<Result<Contract<UserDto>>> {
    return this.authenticationService.getUser(userId);
  }
}
