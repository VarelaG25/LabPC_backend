import type { IAuthenticationService } from '../interfaces/IAuthenticationService';
import type { UserDto } from '../dtos/User.dto';
import { Result } from '../results/Result';

export class GetUserUseCase {
  constructor(private readonly authenticationService: IAuthenticationService) {}

  async execute(userId: number): Promise<Result<UserDto>> {
    return this.authenticationService.getUser(userId);
  }
}
