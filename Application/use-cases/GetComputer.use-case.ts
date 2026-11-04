import type { IComputerService } from '../interfaces/IComputerService';
import type { ComputerDto } from '../dtos/Computer.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class GetComputerUseCase {
  constructor(private readonly computerService: IComputerService) {}

  async execute(id: number): Promise<Result<Contract<ComputerDto>>> {
    return this.computerService.getById(id);
  }
}
