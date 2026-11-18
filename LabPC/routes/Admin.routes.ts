import { Router } from 'express';
import type { AdminController } from '../controllers/Admin.controller';

export function createAdminRoutes(controller: AdminController): Router {
  const router = Router();
  router.get('/stats', (request, response) => controller.getStats(request, response));
  return router;
}
