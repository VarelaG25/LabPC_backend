import type { IAuthenticationService } from '../interfaces/IAuthenticationService';
import type { RegisterRequestDto } from '../dtos/Register.dto';
import type { UserDto } from '../dtos/User.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class RegisterUseCase {
  constructor(private readonly authenticationService: IAuthenticationService) {}

  async execute(request: RegisterRequestDto): Promise<Result<Contract<UserDto>>> {
    return this.authenticationService.register(request);
  }
}
