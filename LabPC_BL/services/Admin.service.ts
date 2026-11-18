import type {
  DashboardStatsDto,
  IAdminService,
  ICommentRepository,
  IComputerRepository,
  IReservationRepository,
  IUserRepository,
} from '../../Application';
import { Result } from '../../Application';
import {
  ComputerStatus,
  IncidentStatus,
  Status,
  TypeMessage,
  type Contract,
} from '../../Domain';
import { toObjectContract } from './Mappers';

const WEEK_DAYS = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const DAY_MS = 24 * 60 * 60 * 1000;

/** Calcula los indicadores del panel de administrador. */
export class AdminService implements IAdminService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly computerRepository: IComputerRepository,
    private readonly reservationRepository: IReservationRepository,
    private readonly commentRepository: ICommentRepository,
  ) {}

  async getStats(): Promise<Result<Contract<DashboardStatsDto>>> {
    const [users, computers, reservations, incidents] = await Promise.all([
      this.userRepository.findAll(),
      this.computerRepository.findAll(),
      this.reservationRepository.findAll(),
      this.commentRepository.findByType(TypeMessage.Issue),
    ]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - ((today.getDay() + 6) % 7));

    const activeReservations = reservations.filter(
      (reservation) => reservation.status !== Status.Cancelled && reservation.start_time,
    );
    const startsOn = (dayStart: Date) =>
      activeReservations.filter((reservation) => {
        const start = Date.parse(reservation.start_time ?? '');
        return start >= dayStart.getTime() && start < dayStart.getTime() + DAY_MS;
      }).length;

    const computersByStatus: Record<string, number> = {};
    for (const status of [
      ComputerStatus.Available,
      ComputerStatus.Reserved,
      ComputerStatus.InUse,
      ComputerStatus.Maintenance,
    ]) {
      computersByStatus[String(status)] = computers.filter((computer) => computer.status === status).length;
    }

    const stats: DashboardStatsDto = {
      totalUsers: users.length,
      totalComputers: computers.length,
      reservationsToday: startsOn(today),
      openIncidents: incidents.filter((incident) => incident.status !== IncidentStatus.Resolved).length,
      reservationsByDay: WEEK_DAYS.map((day, index) => ({
        day,
        count: startsOn(new Date(weekStart.getTime() + index * DAY_MS)),
      })),
      computersByStatus,
    };

    return Result.success(toObjectContract(stats, 0, 'OK'));
  }
}
