import type { IReservationService } from '../interfaces/IReservationService';
import type { ReservationDto } from '../dtos/Reservation.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class GetUserReservationsUseCase {
  constructor(private readonly reservationService: IReservationService) {}

  async execute(userId: number): Promise<Result<Contract<ReservationDto>>> {
    return this.reservationService.getByUser(userId);
  }
}
