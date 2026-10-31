import type { ILaboratoryService } from '../interfaces/ILaboratoryService';
import type { LaboratoryDto } from '../dtos/Laboratory.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class GetLaboratoriesUseCase {
  constructor(private readonly laboratoryService: ILaboratoryService) {}

  async execute(): Promise<Result<Contract<LaboratoryDto>>> {
    return this.laboratoryService.getAll();
  }
}
