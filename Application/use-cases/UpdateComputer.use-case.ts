import type { IComputerService } from '../interfaces/IComputerService';
import type { ComputerDto, ComputerRequestDto } from '../dtos/Computer.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class UpdateComputerUseCase {
  constructor(private readonly computerService: IComputerService) {}

  async execute(id: number, request: ComputerRequestDto): Promise<Result<Contract<ComputerDto>>> {
    return this.computerService.update(id, request);
  }
}
