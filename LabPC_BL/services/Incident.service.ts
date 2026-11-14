import type {
  ICommentRepository,
  IComputerRepository,
  IIncidentService,
  IncidentDto,
  IncidentRequestDto,
  IncidentStatusRequestDto,
  IUserRepository,
} from '../../Application';
import { Messages, Result } from '../../Application';
import {
  Comment,
  Computer,
  IncidentStatus,
  TypeMessage,
  User,
  type Contract,
} from '../../Domain';
import { isEnumValue, isValidId, toIncidentDto, toListContract, toObjectContract } from './Mappers';

/** Las incidencias se guardan como comentarios de tipo Issue, con su propio estado. */
export class IncidentService implements IIncidentService {
  constructor(
    private readonly commentRepository: ICommentRepository,
    private readonly computerRepository: IComputerRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async getAll(): Promise<Result<Contract<IncidentDto>>> {
    const incidents = await this.commentRepository.findByType(TypeMessage.Issue);
    const dtos = incidents
      .map(toIncidentDto)
      .sort((a, b) => (b.created_date ?? '').localeCompare(a.created_date ?? ''));
    return Result.success(toListContract(dtos, 'OK'));
  }

  async create(request: IncidentRequestDto): Promise<Result<Contract<IncidentDto>>> {
    if (!request?.message?.trim()) {
      return Result.failure(Messages.RequiredFields);
    }

    if (!isValidId(request.userId) || !isValidId(request.computerId)) {
      return Result.failure(Messages.InvalidId);
    }

    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      return Result.failure(Messages.UserNotFound);
    }

    const computer = await this.computerRepository.findById(request.computerId);
    if (!computer) {
      return Result.failure(Messages.ComputerNotFound);
    }

    const incident = await this.commentRepository.create(
      new Comment({
        message: request.message.trim(),
        type: TypeMessage.Issue,
        status: IncidentStatus.Open,
        user: new User({ id: user.id, name: user.name, email: user.email, role: user.role }),
        computer: new Computer({ id: computer.id, code: computer.code }),
      }),
    );

    return Result.success(
      toObjectContract(toIncidentDto(incident), incident.id, 'Incidencia registrada correctamente.'),
    );
  }

  async updateStatus(
    id: number,
    request: IncidentStatusRequestDto,
  ): Promise<Result<Contract<IncidentDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    if (!isEnumValue(IncidentStatus, request?.status)) {
      return Result.failure(Messages.IncidentStatusInvalid);
    }

    const incident = await this.commentRepository.findById(id);
    if (!incident || incident.type !== TypeMessage.Issue) {
      return Result.failure(Messages.IncidentNotFound);
    }

    incident.status = request.status;
    incident.changeControl.modified_date = new Date().toISOString();
    await this.commentRepository.update(incident);

    return Result.success(
      toObjectContract(toIncidentDto(incident), incident.id, 'Incidencia actualizada correctamente.'),
    );
  }
}
