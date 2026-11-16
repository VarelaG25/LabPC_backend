/** Indicadores del panel de administrador. */
export interface DashboardStatsDto {
  totalUsers: number;
  totalComputers: number;
  reservationsToday: number;
  /** Incidencias abiertas o en proceso. */
  openIncidents: number;
  /** Reservas de esta semana (sin contar las canceladas), de lunes a domingo. */
  reservationsByDay: { day: string; count: number }[];
  /** Cantidad de equipos por estado. La clave es el número del estado. */
  computersByStatus: Record<string, number>;
}
