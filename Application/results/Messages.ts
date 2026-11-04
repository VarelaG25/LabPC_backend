export const Messages = {
  InvalidId: 'El identificador no es válido.',
  RequiredFields: 'Faltan campos obligatorios.',
  // Usuarios
  UserNotFound: 'Usuario no encontrado.',
  UserIdInvalid: 'El identificador de usuario no es válido.',
  EmailDuplicated: 'Ya existe un usuario con ese correo.',
  // Laboratorios
  LaboratoryNotFound: 'Laboratorio no encontrado.',
  LaboratoryDuplicated: 'Ya existe un laboratorio con ese nombre.',
  LaboratoryHasComputers: 'El laboratorio tiene equipos asignados.',
  // Equipos
  ComputerNotFound: 'Equipo no encontrado.',
  ComputerDuplicated: 'Ya existe un equipo con ese código.',
  ComputerStatusInvalid: 'El estado del equipo no es válido.',
  ComputerInMaintenance: 'El equipo está en mantenimiento.',
  // Reservas
  ReservationNotFound: 'Reserva no encontrada.',
  ReservationConflict: 'El equipo ya tiene una reserva que se empalma con ese horario.',
  ReservationInvalidDuration: 'La duración seleccionada no es válida.',
  ReservationInvalidDate: 'La fecha de inicio no es válida.',
  ReservationPastDate: 'La fecha y hora de inicio ya pasaron.',
  ReservationNotCancellable: 'La reserva ya no puede cancelarse.',
  ReservationCancelWindow:
    'Solo puedes cancelar reservas próximas hasta 1 hora antes de su inicio.',
  // Incidencias
  IncidentNotFound: 'Incidencia no encontrada.',
  IncidentStatusInvalid: 'El estado de la incidencia no es válido.',
} as const;

export const NotFoundMessages: string[] = [
  Messages.UserNotFound,
  Messages.LaboratoryNotFound,
  Messages.ComputerNotFound,
  Messages.ReservationNotFound,
  Messages.IncidentNotFound,
];

export const ConflictMessages: string[] = [
  Messages.EmailDuplicated,
  Messages.LaboratoryDuplicated,
  Messages.LaboratoryHasComputers,
  Messages.ComputerDuplicated,
  Messages.ReservationConflict,
];

export function statusCodeFor(error: string | null): number {
  if (error && NotFoundMessages.includes(error)) {
    return 404;
  }
  if (error && ConflictMessages.includes(error)) {
    return 409;
  }
  return 400;
}
