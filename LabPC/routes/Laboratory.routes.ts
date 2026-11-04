import { Router } from 'express';
import type { LaboratoryController } from '../controllers/Laboratory.controller';

export function createLaboratoryRoutes(controller: LaboratoryController): Router {
  const router = Router();
  router.get('/', (request, response) => controller.getAll(request, response));
  router.get('/:id', (request, response) => controller.getById(request, response));
  router.post('/', (request, response) => controller.create(request, response));
  router.put('/:id', (request, response) => controller.update(request, response));
  router.delete('/:id', (request, response) => controller.remove(request, response));
  return router;
}
