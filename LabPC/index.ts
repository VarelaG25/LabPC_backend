import 'dotenv/config';
import express, { type NextFunction, type Request, type Response } from 'express';
import cors from 'cors';
import {
  CancelReservationUseCase,
  CreateComputerUseCase,
  CreateIncidentUseCase,
  CreateLaboratoryUseCase,
  CreateReservationUseCase,
  DeleteComputerUseCase,
  DeleteLaboratoryUseCase,
  GetComputersUseCase,
  GetDashboardStatsUseCase,
  GetComputerUseCase,
  GetIncidentsUseCase,
  GetLaboratoriesUseCase,
  GetLaboratoryUseCase,
  GetReservationUseCase,
  GetUserReservationsUseCase,
  GetUserUseCase,
  LoginUseCase,
  RegisterUseCase,
  UpdateComputerUseCase,
  UpdateIncidentStatusUseCase,
  UpdateLaboratoryUseCase,
} from '../Application';
import {
  CommentRepository,
  ComputerRepository,
  LaboratoryRepository,
  ReservationRepository,
  UserRepository,
  commentsSeed,
  computersSeed,
  connectDatabase,
  createDataContext,
  laboratoriesSeed,
  reservationsSeed,
  usersSeed,
  type DataSource,
} from '../DLL';
import type { Comment, Computer, Laboratory, Reservation, User } from '../Domain';
import { AdminService } from '../LabPC_BL/services/Admin.service';
import { AuthenticationService } from '../LabPC_BL/services/Authentication.service';
import { ComputerService } from '../LabPC_BL/services/Computer.service';
import { IncidentService } from '../LabPC_BL/services/Incident.service';
import { LaboratoryService } from '../LabPC_BL/services/Laboratory.service';
import { ReservationService } from '../LabPC_BL/services/Reservation.service';
import { AdminController } from './controllers/Admin.controller';
import { AuthenticationController } from './controllers/Authentication.controller';
import { ComputerController } from './controllers/Computer.controller';
import { IncidentController } from './controllers/Incident.controller';
import { LaboratoryController } from './controllers/Laboratory.controller';
import { ReservationController } from './controllers/Reservation.controller';
import { createAdminRoutes } from './routes/Admin.routes';
import { createAuthenticationRoutes } from './routes/Authentication.routes';
import { createComputerRoutes } from './routes/Computer.routes';
import { createIncidentRoutes } from './routes/Incident.routes';
import { createLaboratoryRoutes } from './routes/Laboratory.routes';
import { createReservationRoutes } from './routes/Reservation.routes';

const app = express();
const port = Number(process.env.PORT ?? 4000);
const mongoUri = process.env.MONGODB_URI;
const dataSource: DataSource =
  (process.env.DATA_SOURCE as DataSource | undefined) ?? (mongoUri ? 'mongo' : 'memory');

async function bootstrap(): Promise<void> {
  if (dataSource === 'mongo') {
    if (!mongoUri) {
      throw new Error('DATA_SOURCE=mongo requiere la variable MONGODB_URI.');
    }
    await connectDatabase(mongoUri);
  }

  // Fuentes de datos (en memoria o MongoDB, según DATA_SOURCE)
  const userContext = await createDataContext<User>(dataSource, 'users', usersSeed);
  const laboratoryContext = await createDataContext<Laboratory>(
    dataSource,
    'laboratories',
    laboratoriesSeed,
  );
  const computerContext = await createDataContext<Computer>(dataSource, 'computers', computersSeed);
  const reservationContext = await createDataContext<Reservation>(
    dataSource,
    'reservations',
    reservationsSeed,
  );
  const commentContext = await createDataContext<Comment>(dataSource, 'comments', commentsSeed);

  // Repositorios
  const userRepository = new UserRepository(userContext);
  const laboratoryRepository = new LaboratoryRepository(laboratoryContext);
  const computerRepository = new ComputerRepository(computerContext);
  const reservationRepository = new ReservationRepository(reservationContext);
  const commentRepository = new CommentRepository(commentContext);

  // Servicios
  const authenticationService = new AuthenticationService(userRepository);
  const laboratoryService = new LaboratoryService(laboratoryRepository, computerRepository);
  const computerService = new ComputerService(computerRepository, laboratoryRepository);
  const reservationService = new ReservationService(
    reservationRepository,
    computerRepository,
    userRepository,
  );
  const incidentService = new IncidentService(commentRepository, computerRepository, userRepository);
  const adminService = new AdminService(
    userRepository,
    computerRepository,
    reservationRepository,
    commentRepository,
  );

  // Controladores
  const authenticationController = new AuthenticationController(
    new LoginUseCase(authenticationService),
    new GetUserUseCase(authenticationService),
    new RegisterUseCase(authenticationService),
  );
  const laboratoryController = new LaboratoryController(
    new GetLaboratoriesUseCase(laboratoryService),
    new GetLaboratoryUseCase(laboratoryService),
    new CreateLaboratoryUseCase(laboratoryService),
    new UpdateLaboratoryUseCase(laboratoryService),
    new DeleteLaboratoryUseCase(laboratoryService),
  );
  const computerController = new ComputerController(
    new GetComputersUseCase(computerService),
    new GetComputerUseCase(computerService),
    new CreateComputerUseCase(computerService),
    new UpdateComputerUseCase(computerService),
    new DeleteComputerUseCase(computerService),
  );
  const reservationController = new ReservationController(
    new GetUserReservationsUseCase(reservationService),
    new GetReservationUseCase(reservationService),
    new CreateReservationUseCase(reservationService),
    new CancelReservationUseCase(reservationService),
  );
  const incidentController = new IncidentController(
    new GetIncidentsUseCase(incidentService),
    new CreateIncidentUseCase(incidentService),
    new UpdateIncidentStatusUseCase(incidentService),
  );
  const adminController = new AdminController(new GetDashboardStatsUseCase(adminService));

  app.use(cors());
  app.use(express.json());
  app.use('/api/auth', createAuthenticationRoutes(authenticationController));
  app.use('/api/laboratories', createLaboratoryRoutes(laboratoryController));
  app.use('/api/computers', createComputerRoutes(computerController));
  app.use('/api/reservations', createReservationRoutes(reservationController));
  app.use('/api/incidents', createIncidentRoutes(incidentController));
  app.use('/api/admin', createAdminRoutes(adminController));

  app.use((_request: Request, response: Response) => {
    response.status(404).json({ error: 'Ruta no encontrada.' });
  });

  app.use((error: Error & { type?: string }, _request: Request, response: Response, _next: NextFunction) => {
    if (error.type === 'entity.parse.failed') {
      response.status(400).json({ error: 'El cuerpo de la solicitud no es un JSON válido.' });
      return;
    }
    console.error(error);
    response.status(500).json({ error: 'Error interno del servidor.' });
  });

  app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port} (datos: ${dataSource})`);
  });
}

bootstrap().catch((error: unknown) => {
  console.error('No fue posible iniciar el servidor:', error);
  process.exit(1);
});

export { app };
