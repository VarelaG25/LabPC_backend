import type { IIncidentService } from '../interfaces/IIncidentService';
import type { IncidentDto, IncidentRequestDto } from '../dtos/Incident.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class CreateIncidentUseCase {
  constructor(private readonly incidentService: IIncidentService) {}

  async execute(request: IncidentRequestDto): Promise<Result<Contract<IncidentDto>>> {
    return this.incidentService.create(request);
  }
}
