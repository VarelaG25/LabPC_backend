import type { UserRole } from '../../Domain';

export interface UserDto {
  id: number;
  name: string | null;
  email: string | null;
  role: UserRole;
}
