import type {
  IAuthenticationService,
  IUserRepository,
  LoginRequestDto,
  LoginResponseDto,
  RegisterRequestDto,
  UserDto,
} from '../../Application';
import { Messages, Result } from '../../Application';
import { User, UserRole, type Contract } from '../../Domain';
import { isEnumValue, toObjectContract, toUserDto } from './Mappers';

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
      return Result.failure(Messages.UserIdInvalid);
    }

    const user = await this.userRepository.findById(userId);
    return user
      ? Result.success(toObjectContract(this.toDto(user), user.id, 'OK'))
      : Result.failure(Messages.UserNotFound);
  }

  async register(request: RegisterRequestDto): Promise<Result<Contract<UserDto>>> {
    if (!request?.name?.trim() || !request.email?.trim() || !request.password) {
      return Result.failure(Messages.RequiredFields);
    }

    const role = request.role ?? UserRole.Student;
    if (!isEnumValue(UserRole, role)) {
      return Result.failure('El rol no es válido.');
    }

    if (await this.userRepository.findByEmail(request.email)) {
      return Result.failure(Messages.EmailDuplicated);
    }

    const user = await this.userRepository.create(
      new User({
        name: request.name.trim(),
        email: request.email.trim().toLowerCase(),
        password: request.password,
        role,
      }),
    );

    return Result.success(toObjectContract(this.toDto(user), user.id, 'Usuario registrado correctamente.'));
  }

  private toDto(user: User): UserDto {
    return toUserDto(user);
  }
}
