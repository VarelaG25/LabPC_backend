import type { Result } from '../results/Result';
import type { ComputerDto, ComputerRequestDto } from '../dtos/Computer.dto';
import type { Contract } from '../../Domain';

export interface IComputerService {
  getAll(laboratoryId?: number): Promise<Result<Contract<ComputerDto>>>;
  getById(id: number): Promise<Result<Contract<ComputerDto>>>;
  create(request: ComputerRequestDto): Promise<Result<Contract<ComputerDto>>>;
  update(id: number, request: ComputerRequestDto): Promise<Result<Contract<ComputerDto>>>;
  remove(id: number): Promise<Result<Contract<ComputerDto>>>;
}
