import type { Result } from '../results/Result';
import type { LaboratoryDto, LaboratoryRequestDto } from '../dtos/Laboratory.dto';
import type { Contract } from '../../Domain';

export interface ILaboratoryService {
  getAll(): Promise<Result<Contract<LaboratoryDto>>>;
  getById(id: number): Promise<Result<Contract<LaboratoryDto>>>;
  create(request: LaboratoryRequestDto): Promise<Result<Contract<LaboratoryDto>>>;
  update(id: number, request: LaboratoryRequestDto): Promise<Result<Contract<LaboratoryDto>>>;
  remove(id: number): Promise<Result<Contract<LaboratoryDto>>>;
}
