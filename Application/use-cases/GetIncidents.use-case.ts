import type { IIncidentService } from '../interfaces/IIncidentService';
import type { IncidentDto } from '../dtos/Incident.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class GetIncidentsUseCase {
  constructor(private readonly incidentService: IIncidentService) {}

  async execute(): Promise<Result<Contract<IncidentDto>>> {
    return this.incidentService.getAll();
  }
}
