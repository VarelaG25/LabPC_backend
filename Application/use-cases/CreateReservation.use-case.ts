import type { IReservationService } from '../interfaces/IReservationService';
import type { ReservationDto, ReservationRequestDto } from '../dtos/Reservation.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class CreateReservationUseCase {
  constructor(private readonly reservationService: IReservationService) {}

  async execute(request: ReservationRequestDto): Promise<Result<Contract<ReservationDto>>> {
    return this.reservationService.create(request);
  }
}
