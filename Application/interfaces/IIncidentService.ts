import type { Result } from '../results/Result';
import type {
  IncidentDto,
  IncidentRequestDto,
  IncidentStatusRequestDto,
} from '../dtos/Incident.dto';
import type { Contract } from '../../Domain';

export interface IIncidentService {
  getAll(): Promise<Result<Contract<IncidentDto>>>;
  create(request: IncidentRequestDto): Promise<Result<Contract<IncidentDto>>>;
  updateStatus(
    id: number,
    request: IncidentStatusRequestDto,
  ): Promise<Result<Contract<IncidentDto>>>;
}
