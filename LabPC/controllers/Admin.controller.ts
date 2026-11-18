import type { Request, Response } from 'express';
import type { GetDashboardStatsUseCase } from '../../Application';
import { statusCodeFor } from '../../Application';

export class AdminController {
  constructor(private readonly getDashboardStatsUseCase: GetDashboardStatsUseCase) {}

  async getStats(_request: Request, response: Response): Promise<void> {
    const result = await this.getDashboardStatsUseCase.execute();
    if (!result.isSuccess) {
      response.status(statusCodeFor(result.error)).json({ error: result.error });
      return;
    }

    response.status(200).json(result.value);
  }
}
