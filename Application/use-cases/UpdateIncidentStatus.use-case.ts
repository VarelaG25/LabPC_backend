import type { IIncidentService } from '../interfaces/IIncidentService';
import type { IncidentDto, IncidentStatusRequestDto } from '../dtos/Incident.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class UpdateIncidentStatusUseCase {
  constructor(private readonly incidentService: IIncidentService) {}

  async execute(id: number, request: IncidentStatusRequestDto): Promise<Result<Contract<IncidentDto>>> {
    return this.incidentService.updateStatus(id, request);
  }
}
