import type { Reservation } from '../../Domain';

export interface IReservationRepository {
  findAll(): Promise<Reservation[]>;
  findById(id: number): Promise<Reservation | null>;
  findByUser(userId: number): Promise<Reservation[]>;
  findByComputer(computerId: number): Promise<Reservation[]>;
  nextCode(year: number): Promise<string>;
  create(reservation: Reservation): Promise<Reservation>;
  update(reservation: Reservation): Promise<Reservation | null>;
}
