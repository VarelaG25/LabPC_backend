import type { Request, Response } from 'express';
import type {
  CreateIncidentUseCase,
  GetIncidentsUseCase,
  Result,
  UpdateIncidentStatusUseCase,
} from '../../Application';
import { statusCodeFor } from '../../Application';

export class IncidentController {
  constructor(
    private readonly getIncidentsUseCase: GetIncidentsUseCase,
    private readonly createIncidentUseCase: CreateIncidentUseCase,
    private readonly updateIncidentStatusUseCase: UpdateIncidentStatusUseCase,
  ) {}

  async getAll(_request: Request, response: Response): Promise<void> {
    this.send(response, await this.getIncidentsUseCase.execute(), 200);
  }

  async create(request: Request, response: Response): Promise<void> {
    this.send(response, await this.createIncidentUseCase.execute(request.body ?? {}), 201);
  }

  async updateStatus(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.updateIncidentStatusUseCase.execute(id, request.body ?? {}), 200);
  }

  private send<T>(response: Response, result: Result<T>, successStatus: number): void {
    if (!result.isSuccess) {
      response.status(statusCodeFor(result.error)).json({ error: result.error });
      return;
    }

    response.status(successStatus).json(result.value);
  }
}
