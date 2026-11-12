import type { IReservationService } from '../interfaces/IReservationService';
import type { ReservationDto } from '../dtos/Reservation.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class CancelReservationUseCase {
  constructor(private readonly reservationService: IReservationService) {}

  async execute(id: number): Promise<Result<Contract<ReservationDto>>> {
    return this.reservationService.cancel(id);
  }
}
