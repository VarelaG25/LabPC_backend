import type { Result } from '../results/Result';
import type { LoginRequestDto } from '../dtos/LoginRequest.dto';
import type { LoginResponseDto } from '../dtos/LoginResponse.dto';
import type { RegisterRequestDto } from '../dtos/Register.dto';
import type { UserDto } from '../dtos/User.dto';
import { Contract } from '../../Domain';

export interface IAuthenticationService {
  login(request: LoginRequestDto): Promise<Result<LoginResponseDto>>;
  getUser(userId: number): Promise<Result<Contract<UserDto>>>;
  register(request: RegisterRequestDto): Promise<Result<Contract<UserDto>>>;
}
