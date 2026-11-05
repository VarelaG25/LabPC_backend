import type {
  IAuthenticationService,
  IUserRepository,
  LoginRequestDto,
  LoginResponseDto,
  UserDto,
} from '../../Application';
import { Result } from '../../Application';
import { Contract, RespOp, type User } from '../../Domain';

export class AuthenticationService implements IAuthenticationService {
  constructor(private readonly userRepository: IUserRepository) {}

  async login(request: LoginRequestDto): Promise<Result<LoginResponseDto>> {
    if (!request.username?.trim() || !request.password) {
      return Result.failure('El usuario y la contraseña son obligatorios.');
    }

    const user = await this.userRepository.findByUsername(request.username);
    if (!user || user.password !== request.password) {
      return Result.failure('Las credenciales no son válidas.');
    }

    return Result.success({ user: this.toDto(user) });
  }

  async getUser(userId: number): Promise<Result<Contract<UserDto>>> {
    if (!Number.isInteger(userId) || userId <= 0) {
      return Result.failure('El identificador de usuario no es válido.');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      return Result.failure('Usuario no encontrado.');
    }

    const contract = new Contract<UserDto>();
    contract.RespOp = RespOp.Ok;
    contract.Object = this.toDto(user);
    contract.ObjectId = user.id;
    contract.Response = 'OK';
    contract.Total = 1;
    return Result.success(contract);
  }

  private toDto(user: User): UserDto {
    return {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    };
  }
}
