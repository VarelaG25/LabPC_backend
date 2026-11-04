import type { ILaboratoryService } from '../interfaces/ILaboratoryService';
import type { LaboratoryDto, LaboratoryRequestDto } from '../dtos/Laboratory.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class CreateLaboratoryUseCase {
  constructor(private readonly laboratoryService: ILaboratoryService) {}

  async execute(request: LaboratoryRequestDto): Promise<Result<Contract<LaboratoryDto>>> {
    return this.laboratoryService.create(request);
  }
}
