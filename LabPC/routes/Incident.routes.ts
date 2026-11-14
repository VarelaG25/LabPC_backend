import { Router } from 'express';
import type { IncidentController } from '../controllers/Incident.controller';

export function createIncidentRoutes(controller: IncidentController): Router {
  const router = Router();
  router.get('/', (request, response) => controller.getAll(request, response));
  router.post('/', (request, response) => controller.create(request, response));
  router.patch('/:id/status', (request, response) => controller.updateStatus(request, response));
  return router;
}
