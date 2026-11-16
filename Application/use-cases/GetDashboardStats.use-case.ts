import type { IAdminService } from '../interfaces/IAdminService';
import type { DashboardStatsDto } from '../dtos/DashboardStats.dto';
import { Result } from '../results/Result';
import { Contract } from '../../Domain';

export class GetDashboardStatsUseCase {
  constructor(private readonly adminService: IAdminService) {}

  async execute(): Promise<Result<Contract<DashboardStatsDto>>> {
    return this.adminService.getStats();
  }
}
