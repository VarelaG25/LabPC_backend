import type { IReservationRepository } from '../../Application';
import { Reservation } from '../../Domain';
import type { IDataContext } from '../context/IDataContext';

export class ReservationRepository implements IReservationRepository {
  constructor(private readonly context: IDataContext<Reservation>) {}

  async findAll(): Promise<Reservation[]> {
    return this.findActive();
  }

  async findById(id: number): Promise<Reservation | null> {
    const reservation = await this.context.findOne({ id });
    return reservation && reservation.changeControl?.eliminated !== 1 ? reservation : null;
  }

  async findByUser(userId: number): Promise<Reservation[]> {
    const reservations = await this.findActive();
    return reservations.filter((reservation) => reservation.user?.id === userId);
  }

  async findByComputer(computerId: number): Promise<Reservation[]> {
    const reservations = await this.findActive();
    return reservations.filter((reservation) => reservation.computer?.id === computerId);
  }

  async nextCode(year: number): Promise<string> {
    const prefix = `RES-${year}-`;
    const reservations = await this.context.find();
    const last = reservations
      .filter((reservation) => reservation.code?.startsWith(prefix))
      .reduce((max, reservation) => Math.max(max, Number(reservation.code?.slice(prefix.length))), 0);
    return `${prefix}${String(last + 1).padStart(5, '0')}`;
  }

  async create(reservation: Reservation): Promise<Reservation> {
    reservation.id = await this.context.nextId();
    return this.context.insertOne(reservation);
  }

  async update(reservation: Reservation): Promise<Reservation | null> {
    return this.context.updateOne({ id: reservation.id }, { $set: { ...reservation } });
  }

  private async findActive(): Promise<Reservation[]> {
    const reservations = await this.context.find();
    return reservations.filter((reservation) => reservation.changeControl?.eliminated !== 1);
  }
}
