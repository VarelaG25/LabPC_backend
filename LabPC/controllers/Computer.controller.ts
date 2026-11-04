import type { Request, Response } from 'express';
import type {
  CreateComputerUseCase,
  DeleteComputerUseCase,
  GetComputersUseCase,
  GetComputerUseCase,
  Result,
  UpdateComputerUseCase,
} from '../../Application';
import { statusCodeFor } from '../../Application';

export class ComputerController {
  constructor(
    private readonly getComputersUseCase: GetComputersUseCase,
    private readonly getComputerUseCase: GetComputerUseCase,
    private readonly createComputerUseCase: CreateComputerUseCase,
    private readonly updateComputerUseCase: UpdateComputerUseCase,
    private readonly deleteComputerUseCase: DeleteComputerUseCase,
  ) {}

  async getAll(request: Request, response: Response): Promise<void> {
    const laboratoryId =
      request.query.laboratoryId === undefined ? undefined : Number(request.query.laboratoryId);
    this.send(response, await this.getComputersUseCase.execute(laboratoryId), 200);
  }

  async getById(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.getComputerUseCase.execute(id), 200);
  }

  async create(request: Request, response: Response): Promise<void> {
    this.send(response, await this.createComputerUseCase.execute(request.body ?? {}), 201);
  }

  async update(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.updateComputerUseCase.execute(id, request.body ?? {}), 200);
  }

  async remove(request: Request, response: Response): Promise<void> {
    const id = Number(request.params.id);
    this.send(response, await this.deleteComputerUseCase.execute(id), 200);
  }

  private send<T>(response: Response, result: Result<T>, successStatus: number): void {
    if (!result.isSuccess) {
      response.status(statusCodeFor(result.error)).json({ error: result.error });
      return;
    }

    response.status(successStatus).json(result.value);
  }
}
