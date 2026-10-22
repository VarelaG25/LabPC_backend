import { Router } from 'express';
import type { AuthenticationController } from '../controllers/Authentication.controller';

export function createAuthenticationRoutes(controller: AuthenticationController): Router {
  const router = Router();
  router.post('/login', (request, response) => controller.login(request, response));
  router.get('/users/:userId', (request, response) => controller.getUser(request, response));
  return router;
}
