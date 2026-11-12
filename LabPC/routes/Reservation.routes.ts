import { Router } from 'express';
import type { ReservationController } from '../controllers/Reservation.controller';

export function createReservationRoutes(controller: ReservationController): Router {
  const router = Router();
  router.post('/', (request, response) => controller.create(request, response));
  router.get('/user/:userId', (request, response) => controller.getByUser(request, response));
  router.get('/:id', (request, response) => controller.getById(request, response));
  router.patch('/:id/cancel', (request, response) => controller.cancel(request, response));
  return router;
}
