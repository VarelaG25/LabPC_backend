import type {
  IComputerRepository,
  IReservationRepository,
  IReservationService,
  IUserRepository,
  ReservationDto,
  ReservationRequestDto,
} from '../../Application';
import { Messages, Result } from '../../Application';
import { ComputerStatus, Reservation, Status, User, type Contract } from '../../Domain';
import { isValidId, toListContract, toObjectContract, toReservationDto } from './Mappers';

const ALLOWED_DURATION_HOURS = [1, 2];
const CANCEL_WINDOW_MS = 60 * 60 * 1000;
const BLOCKING_STATUSES = [Status.Reserved, Status.Active];

export class ReservationService implements IReservationService {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly computerRepository: IComputerRepository,
    private readonly userRepository: IUserRepository,
  ) {}

  async getByUser(userId: number): Promise<Result<Contract<ReservationDto>>> {
    if (!isValidId(userId)) {
      return Result.failure(Messages.UserIdInvalid);
    }

    if (!(await this.userRepository.findById(userId))) {
      return Result.failure(Messages.UserNotFound);
    }

    const reservations = await this.reservationRepository.findByUser(userId);
    const dtos = await Promise.all(reservations.map((reservation) => this.toDto(reservation)));
    dtos.sort((a, b) => (b.start_time ?? '').localeCompare(a.start_time ?? ''));
    return Result.success(toListContract(dtos, 'OK'));
  }

  async getById(id: number): Promise<Result<Contract<ReservationDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const reservation = await this.reservationRepository.findById(id);
    return reservation
      ? Result.success(toObjectContract(await this.toDto(reservation), reservation.id, 'OK'))
      : Result.failure(Messages.ReservationNotFound);
  }

  async create(request: ReservationRequestDto): Promise<Result<Contract<ReservationDto>>> {
    if (!request?.topic?.trim() || !request.start_time || request.durationHours === undefined) {
      return Result.failure(Messages.RequiredFields);
    }

    if (!isValidId(request.userId) || !isValidId(request.computerId)) {
      return Result.failure(Messages.InvalidId);
    }

    if (!ALLOWED_DURATION_HOURS.includes(request.durationHours)) {
      return Result.failure(Messages.ReservationInvalidDuration);
    }

    const start = Date.parse(request.start_time);
    if (Number.isNaN(start)) {
      return Result.failure(Messages.ReservationInvalidDate);
    }

    if (start <= Date.now()) {
      return Result.failure(Messages.ReservationPastDate);
    }

    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      return Result.failure(Messages.UserNotFound);
    }

    const computer = await this.computerRepository.findById(request.computerId);
    if (!computer) {
      return Result.failure(Messages.ComputerNotFound);
    }

    if (computer.status === ComputerStatus.Maintenance) {
      return Result.failure(Messages.ComputerInMaintenance);
    }

    const end = start + request.durationHours * 60 * 60 * 1000;
    const reservations = await this.reservationRepository.findByComputer(computer.id);
    const overlaps = reservations.some(
      (reservation) =>
        BLOCKING_STATUSES.includes(reservation.status) &&
        start < Date.parse(reservation.end_time ?? '') &&
        end > Date.parse(reservation.start_time ?? ''),
    );
    if (overlaps) {
      return Result.failure(Messages.ReservationConflict);
    }

    const reservation = await this.reservationRepository.create(
      new Reservation({
        code: await this.reservationRepository.nextCode(new Date(start).getUTCFullYear()),
        topic: request.topic.trim(),
        description: request.description?.trim() || null,
        start_time: new Date(start).toISOString(),
        end_time: new Date(end).toISOString(),
        status: Status.Reserved,
        user: new User({ id: user.id, name: user.name, email: user.email, role: user.role }),
        computer,
      }),
    );

    return Result.success(
      toObjectContract(
        await this.toDto(reservation),
        reservation.id,
        'Reserva creada correctamente.',
      ),
    );
  }

  async cancel(id: number): Promise<Result<Contract<ReservationDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const reservation = await this.reservationRepository.findById(id);
    if (!reservation) {
      return Result.failure(Messages.ReservationNotFound);
    }

    if (reservation.status !== Status.Reserved) {
      return Result.failure(Messages.ReservationNotCancellable);
    }

    if (Date.parse(reservation.start_time ?? '') - Date.now() < CANCEL_WINDOW_MS) {
      return Result.failure(Messages.ReservationCancelWindow);
    }

    reservation.status = Status.Cancelled;
    reservation.changeControl.modified_date = new Date().toISOString();
    await this.reservationRepository.update(reservation);

    return Result.success(
      toObjectContract(
        await this.toDto(reservation),
        reservation.id,
        'Reserva cancelada correctamente.',
      ),
    );
  }

  /** Agrega los datos actuales del equipo. */
  private async toDto(reservation: Reservation): Promise<ReservationDto> {
    const computer = reservation.computer
      ? await this.computerRepository.findById(reservation.computer.id)
      : null;
    return toReservationDto(reservation, computer);
  }
}
