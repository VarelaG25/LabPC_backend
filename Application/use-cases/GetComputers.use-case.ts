import type { IComputerService } from '../interfaces/IComputerService';
import type { ComputerDto } from '../dtos/Computer.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class GetComputersUseCase {
  constructor(private readonly computerService: IComputerService) {}

  async execute(laboratoryId?: number): Promise<Result<Contract<ComputerDto>>> {
    return this.computerService.getAll(laboratoryId);
  }
}
