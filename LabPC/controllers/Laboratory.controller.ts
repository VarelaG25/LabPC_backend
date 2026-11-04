import type { Request, Response } from 'express';
import type {
  CreateLaboratoryUseCase,
  DeleteLaboratoryUseCase,
  GetLaboratoriesUseCase,
  GetLaboratoryUseCase,
  Result,
  UpdateLaboratoryUseCase,
} from '../../Application';
import { statusCodeFor } from '../../Application';

export class LaboratoryController {
  constructor(
    private readonly getLaboratoriesUseCase: GetLaboratoriesUseCase,
    private readonly getLaboratoryUseCase: GetLaboratoryUseCase,
    private readonly createLaboratoryUseCase: CreateLaboratoryUseCase,
    private readonly updateLaboratoryUseCase: UpdateLaboratoryUseCase,
    private readonly deleteLaboratoryUseCase: DeleteLaboratoryUseCase,
  ) {}

  async getAll(_request: Request, response: Response): Promise<void> {
    this.send(response, await this.getLaboratoriesUseCase.execute(), 200);
  }

  async getById(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.getLaboratoryUseCase.execute(id), 200);
  }

  async create(request: Request, response: Response): Promise<void> {
    this.send(response, await this.createLaboratoryUseCase.execute(request.body ?? {}), 201);
  }

  async update(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.updateLaboratoryUseCase.execute(id, request.body ?? {}), 200);
  }

  async remove(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.deleteLaboratoryUseCase.execute(id), 200);
  }

  private send<T>(response: Response, result: Result<T>, successStatus: number): void {
    if (!result.isSuccess) {
      response.status(statusCodeFor(result.error)).json({ error: result.error });
      return;
    }

    response.status(successStatus).json(result.value);
  }
}
