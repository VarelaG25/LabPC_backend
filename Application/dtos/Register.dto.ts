import type { UserRole } from '../../Domain';

export interface RegisterRequestDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}
