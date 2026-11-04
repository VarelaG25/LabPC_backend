import type { IComputerService } from '../interfaces/IComputerService';
import type { ComputerDto, ComputerRequestDto } from '../dtos/Computer.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class CreateComputerUseCase {
  constructor(private readonly computerService: IComputerService) {}

  async execute(request: ComputerRequestDto): Promise<Result<Contract<ComputerDto>>> {
    return this.computerService.create(request);
  }
}
