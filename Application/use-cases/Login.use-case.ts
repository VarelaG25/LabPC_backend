import type { IAuthenticationService } from '../interfaces/IAuthenticationService';
import type { LoginRequestDto } from '../dtos/LoginRequest.dto';
import type { LoginResponseDto } from '../dtos/LoginResponse.dto';
import { Result } from '../results/Result';

export class LoginUseCase {
  constructor(private readonly authenticationService: IAuthenticationService) {}

  async execute(request: LoginRequestDto): Promise<Result<LoginResponseDto>> {
    return this.authenticationService.login(request);
  }
}
