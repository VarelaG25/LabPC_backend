import type { Status } from '../../Domain';
import type { ComputerDto } from './Computer.dto';

export interface ReservationDto {
  id: number;
  code: string | null;
  topic: string | null;
  description: string | null;
  start_time: string | null;
  end_time: string | null;
  durationMinutes: number;
  status: Status;
  userId: number | null;
  computerId: number | null;
  computer: ComputerDto | null;
  created_date: string | null;
}

export interface ReservationRequestDto {
  userId: number;
  computerId: number;
  topic: string;
  description?: string | null;
  start_time: string;
  durationHours: number;
}
