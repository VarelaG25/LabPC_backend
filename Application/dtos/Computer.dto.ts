import type { ComputerStatus } from '../../Domain';
import type { LaboratoryDto } from './Laboratory.dto';

export interface ComputerDto {
  id: number;
  code: string | null;
  specs: string | null;
  status: ComputerStatus;
  laboratoryId: number | null;
  laboratory: LaboratoryDto | null;
  created_date: string | null;
}

export interface ComputerRequestDto {
  code: string;
  specs?: string | null;
  status?: ComputerStatus;
  laboratoryId: number;
}
