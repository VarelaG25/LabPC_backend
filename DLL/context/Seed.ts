import {
  ChangeControl,
  Comment,
  Computer,
  ComputerStatus,
  IncidentStatus,
  Laboratory,
  Reservation,
  Status,
  TypeMessage,
  User,
  UserRole,
} from '../../Domain';

/**
 * Datos de ejemplo para desarrollo y pruebas.
 * Se usan directamente cuando los datos viven en memoria, o para llenar MongoDB.
 * Las fechas de reservas e incidencias se calculan a partir del día en que se cargan.
 */

/** Fecha relativa a hoy, en hora local. Por ejemplo, `relativeDate(2, 10)` es pasado mañana a las 10:00. */
function relativeDate(daysFromToday: number, hour: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  date.setHours(hour, 0, 0, 0);
  return date.toISOString();
}

function changeControl(createdDate: string): ChangeControl {
  const control = new ChangeControl();
  control.created_date = createdDate;
  return control;
}

const publicUser = (user: User): User =>
  new User({ id: user.id, name: user.name, email: user.email, role: user.role });

// Usuarios

export const usersSeed: User[] = [
  new User({ id: 1, name: 'admin', email: 'admin@labpc.local', password: 'admin123', role: UserRole.Admin }),
  new User({
    id: 2,
    name: 'Ana López',
    email: 'ana.lopez@universidad.edu',
    password: 'labpc123',
    role: UserRole.Student,
  }),
  new User({
    id: 3,
    name: 'Encargado Lab.',
    email: 'encargado@universidad.edu',
    password: 'encargado123',
    role: UserRole.Admin,
  }),
];

const [admin, ana, encargado] = usersSeed;

// Laboratorios

const LAB_CREATED = '2025-01-10T15:00:00.000Z';

export const laboratoriesSeed: Laboratory[] = [
  [1, 'Lab. Bases de Datos', 'Edificio A · Planta baja', 20],
  [2, 'Lab. Redes', 'Edificio A · Primer piso', 16],
  [3, 'Lab. Programación', 'Edificio B · Primer piso', 24],
  [4, 'Lab. Diseño', 'Edificio B · Segundo piso', 20],
  [5, 'Lab. Multimedia', 'Edificio C · Planta baja', 20],
].map(
  ([id, name, location, capacity]) =>
    new Laboratory({
      id: id as number,
      name: name as string,
      location: location as string,
      capacity: capacity as number,
      changeControl: changeControl(LAB_CREATED),
    }),
);

// Equipos: 12 disponibles, 4 en uso, 3 reservados y 1 en mantenimiento

const SPECS = {
  i7: 'Intel i7 / 16GB RAM / 1TB HDD / Windows 11',
  i5: 'Intel i5 / 8GB RAM / 512GB SSD / Windows 11',
  ryzen: 'Ryzen 5 / 16GB RAM / 1TB HDD / Windows 11',
} as const;

const LAB = { databases: 1, networks: 2, programming: 3, design: 4, multimedia: 5 } as const;
const PC = ComputerStatus;

const computerRows: [number, number, string, ComputerStatus][] = [
  [1, LAB.programming, SPECS.i7, PC.Available],
  [2, LAB.programming, SPECS.i7, PC.Available],
  [3, LAB.networks, SPECS.i5, PC.Available],
  [4, LAB.design, SPECS.i7, PC.Reserved],
  [5, LAB.multimedia, SPECS.ryzen, PC.Available],
  [6, LAB.programming, SPECS.i5, PC.InUse],
  [7, LAB.databases, SPECS.i7, PC.Available],
  [8, LAB.networks, SPECS.i5, PC.Maintenance],
  [9, LAB.databases, SPECS.i7, PC.Available],
  [10, LAB.design, SPECS.ryzen, PC.InUse],
  [11, LAB.multimedia, SPECS.ryzen, PC.Available],
  [12, LAB.networks, SPECS.i5, PC.Reserved],
  [13, LAB.programming, SPECS.i7, PC.Available],
  [14, LAB.databases, SPECS.i5, PC.InUse],
  [15, LAB.design, SPECS.i7, PC.Available],
  [16, LAB.multimedia, SPECS.ryzen, PC.Reserved],
  [17, LAB.programming, SPECS.i5, PC.Available],
  [18, LAB.networks, SPECS.i5, PC.InUse],
  [19, LAB.databases, SPECS.i7, PC.Available],
  [20, LAB.design, SPECS.i7, PC.Available],
];

export const computersSeed: Computer[] = computerRows.map(
  ([id, laboratoryId, specs, status]) =>
    new Computer({
      id,
      code: `PC-${String(id).padStart(2, '0')}`,
      specs,
      status,
      laboratory: laboratoriesSeed.find((laboratory) => laboratory.id === laboratoryId),
      changeControl: changeControl('2025-01-15T15:00:00.000Z'),
    }),
);

const computerById = (id: number): Computer =>
  computersSeed.find((computer) => computer.id === id) as Computer;

// Reservas

interface ReservationSeed {
  id: number;
  computerId: number;
  user?: User;
  day: number;
  hour: number;
  hours?: number;
  status: Status;
  topic: string;
  description?: string;
}

function reservation(seed: ReservationSeed): Reservation {
  const { id, computerId, user = ana, day, hour, hours = 1, status, topic, description } = seed;
  const start = relativeDate(day, hour);
  const end = new Date(Date.parse(start) + hours * 60 * 60 * 1000).toISOString();
  return new Reservation({
    id,
    code: `RES-${new Date(start).getUTCFullYear()}-${String(id).padStart(5, '0')}`,
    topic,
    description: description ?? null,
    start_time: start,
    end_time: end,
    status,
    user: publicUser(user),
    computer: computerById(computerId),
    changeControl: changeControl(relativeDate(day - 3, 9)),
  });
}

export const reservationsSeed: Reservation[] = [
  // Próximas
  reservation({
    id: 1,
    computerId: 7,
    day: 2,
    hour: 10,
    status: Status.Reserved,
    topic: 'Desarrollo de aplicación web para gestión de inventarios',
    description: 'Desarrollo y pruebas de funcionalidades del sistema.',
  }),
  reservation({ id: 2, computerId: 3, day: 4, hour: 14, status: Status.Reserved, topic: 'Práctica de configuración de redes' }),
  reservation({ id: 3, computerId: 2, day: 7, hour: 9, status: Status.Reserved, topic: 'Proyecto final de Programación Web II' }),
  // Completadas
  reservation({ id: 4, computerId: 1, day: -1, hour: 9, status: Status.Completed, topic: 'Práctica de estructuras de datos' }),
  reservation({ id: 5, computerId: 5, day: -2, hour: 11, hours: 2, status: Status.Completed, topic: 'Edición de video para proyecto' }),
  reservation({ id: 6, computerId: 7, day: -4, hour: 16, status: Status.Completed, topic: 'Consultas SQL avanzadas' }),
  reservation({ id: 7, computerId: 2, day: -6, hour: 10, status: Status.Completed, topic: 'Pruebas unitarias' }),
  reservation({ id: 8, computerId: 3, day: -9, hour: 13, status: Status.Completed, topic: 'Simulación de redes' }),
  reservation({ id: 9, computerId: 9, day: -12, hour: 8, hours: 2, status: Status.Completed, topic: 'Modelado de base de datos' }),
  reservation({ id: 10, computerId: 13, day: -40, hour: 15, status: Status.Completed, topic: 'Investigación de algoritmos' }),
  // Canceladas
  reservation({ id: 11, computerId: 4, day: -3, hour: 9, status: Status.Cancelled, topic: 'Diseño de interfaz' }),
  reservation({ id: 12, computerId: 11, day: 5, hour: 17, status: Status.Cancelled, topic: 'Renderizado 3D' }),
  // De otros usuarios. La de PC-07 (pasado mañana a las 12:00) sirve para probar un choque de horario
  reservation({ id: 13, computerId: 7, user: admin, day: 2, hour: 12, status: Status.Reserved, topic: 'Tesis' }),
  reservation({ id: 14, computerId: 4, user: encargado, day: 0, hour: 18, status: Status.Reserved, topic: 'Proyecto integrador' }),
];

// Incidencias (se guardan como comentarios de tipo Issue)

const incidentRows: [number, number, string, IncidentStatus, User, number][] = [
  [1, 8, 'No enciende el equipo.', IncidentStatus.InProgress, encargado, 0],
  [2, 4, 'Teclado con teclas fallando.', IncidentStatus.InProgress, encargado, 1],
  [3, 11, 'El mouse no responde.', IncidentStatus.Open, ana, 2],
  [4, 6, 'Internet intermitente.', IncidentStatus.Resolved, admin, 3],
  [5, 2, 'Pantalla parpadea.', IncidentStatus.Resolved, encargado, 4],
];

export const commentsSeed: Comment[] = incidentRows.map(
  ([id, computerId, message, status, user, daysAgo]) =>
    new Comment({
      id,
      message,
      type: TypeMessage.Issue,
      status,
      user: publicUser(user),
      computer: new Computer({ id: computerId, code: computerById(computerId).code }),
      changeControl: changeControl(relativeDate(-daysAgo, 9 + id)),
    }),
);
