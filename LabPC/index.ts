import express from 'express';
import cors from 'cors';
import { GetUserUseCase, LoginUseCase } from '../Application';
import { MongoContext, UserRepository } from '../DLL';
import { User } from '../Domain';
import { AuthenticationService } from '../LabPC_BL/services/Authentication.service';
import { AuthenticationController } from './controllers/Authentication.controller';
import { createAuthenticationRoutes } from './routes/Authentication.routes';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const context = new MongoContext<User>([
  new User({ id: 1, name: 'admin', email: 'admin@labpc.local', password: 'admin123' }),
]);
const repository = new UserRepository(context);
const service = new AuthenticationService(repository);
const controller = new AuthenticationController(
  new LoginUseCase(service),
  new GetUserUseCase(service),
);

app.use(cors());
app.use(express.json());
app.use('/api/auth', createAuthenticationRoutes(controller));

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});

export { app };
