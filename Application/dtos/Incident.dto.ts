import type { IncidentStatus, TypeMessage } from '../../Domain';

export interface IncidentDto {
  id: number;
  message: string | null;
  type: TypeMessage;
  status: IncidentStatus;
  userId: number | null;
  userName: string | null;
  computerId: number | null;
  computerCode: string | null;
  created_date: string | null;
}

export interface IncidentRequestDto {
  userId: number;
  computerId: number;
  message: string;
}

export interface IncidentStatusRequestDto {
  status: IncidentStatus;
}
