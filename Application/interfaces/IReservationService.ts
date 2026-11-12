import type { Result } from '../results/Result';
import type { ReservationDto, ReservationRequestDto } from '../dtos/Reservation.dto';
import type { Contract } from '../../Domain';

export interface IReservationService {
  getByUser(userId: number): Promise<Result<Contract<ReservationDto>>>;
  getById(id: number): Promise<Result<Contract<ReservationDto>>>;
  create(request: ReservationRequestDto): Promise<Result<Contract<ReservationDto>>>;
  cancel(id: number): Promise<Result<Contract<ReservationDto>>>;
}
