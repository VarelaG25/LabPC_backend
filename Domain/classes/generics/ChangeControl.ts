export class ChangeControl {
  created_date: string | null = new Date().toISOString();
  created_user: number | null = null;
  modified_date?: string | null = null;
  modified_user?: number | null = null;
  active: number | null = 1;
  eliminated: number | null = 0;
}
