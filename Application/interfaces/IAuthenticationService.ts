import type { Result } from '../results/Result';
import type { LoginRequestDto } from '../dtos/LoginRequest.dto';
import type { LoginResponseDto } from '../dtos/LoginResponse.dto';
import type { UserDto } from '../dtos/User.dto';

export interface IAuthenticationService {
  login(request: LoginRequestDto): Promise<Result<LoginResponseDto>>;
  getUser(userId: number): Promise<Result<UserDto>>;
}
