import type { Request, Response } from 'express';
import type {
  CancelReservationUseCase,
  CreateReservationUseCase,
  GetReservationUseCase,
  GetUserReservationsUseCase,
  Result,
} from '../../Application';
import { statusCodeFor } from '../../Application';

export class ReservationController {
  constructor(
    private readonly getUserReservationsUseCase: GetUserReservationsUseCase,
    private readonly getReservationUseCase: GetReservationUseCase,
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
  ) {}

  async getByUser(request: Request, response: Response): Promise<void> {
    const userId = Number(request.params.userId);
    this.send(response, await this.getUserReservationsUseCase.execute(userId), 200);
  }

  async getById(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.getReservationUseCase.execute(id), 200);
  }

  async create(request: Request, response: Response): Promise<void> {
    this.send(response, await this.createReservationUseCase.execute(request.body ?? {}), 201);
  }

  async cancel(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.cancelReservationUseCase.execute(id), 200);
  }

  private send<T>(response: Response, result: Result<T>, successStatus: number): void {
    if (!result.isSuccess) {
      response.status(statusCodeFor(result.error)).json({ error: result.error });
      return;
    }

    response.status(successStatus).json(result.value);
  }
}
