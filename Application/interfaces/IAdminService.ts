import type { Result } from '../results/Result';
import type { DashboardStatsDto } from '../dtos/DashboardStats.dto';
import type { Contract } from '../../Domain';

export interface IAdminService {
  getStats(): Promise<Result<Contract<DashboardStatsDto>>>;
}
