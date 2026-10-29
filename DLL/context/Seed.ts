import {
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
 */

export const usersSeed: User[] = [
  new User({
    id: 1,
    name: 'admin',
    email: 'admin@labpc.local',
    password: 'admin123',
    role: UserRole.Admin,
  }),
  new User({
    id: 2,
    name: 'Ana López',
    email: 'ana.lopez@universidad.edu',
    password: 'labpc123',
    role: UserRole.Student,
  }),
];

export const laboratoriesSeed: Laboratory[] = [
  new Laboratory({ id: 1, name: 'Lab. Bases de Datos', location: 'Edificio A · Planta baja', capacity: 20 }),
  new Laboratory({ id: 2, name: 'Lab. Redes', location: 'Edificio A · Primer piso', capacity: 16 }),
  new Laboratory({ id: 3, name: 'Lab. Programación', location: 'Edificio B · Primer piso', capacity: 24 }),
  new Laboratory({ id: 4, name: 'Lab. Sistemas Operativos', location: 'Edificio B · Segundo piso', capacity: 18 }),
];

const [databases, networks, programming, systems] = laboratoriesSeed;

export const computersSeed: Computer[] = [
  new Computer({ id: 1, code: 'PC-01', specs: 'Intel i5 / 8GB RAM / 512GB SSD / Windows 11', status: ComputerStatus.Available, laboratory: databases }),
  new Computer({ id: 2, code: 'PC-02', specs: 'Intel i5 / 8GB RAM / 512GB SSD / Windows 11', status: ComputerStatus.InUse, laboratory: databases }),
  new Computer({ id: 3, code: 'PC-07', specs: 'Intel i7 / 16GB RAM / 1TB HDD / Windows 11', status: ComputerStatus.Available, laboratory: databases }),
  new Computer({ id: 4, code: 'PC-08', specs: 'Intel i7 / 16GB RAM / 1TB HDD / Windows 11', status: ComputerStatus.Maintenance, laboratory: databases }),
  new Computer({ id: 5, code: 'PC-11', specs: 'AMD Ryzen 5 / 16GB RAM / 512GB SSD / Ubuntu 24.04', status: ComputerStatus.Available, laboratory: networks }),
  new Computer({ id: 6, code: 'PC-12', specs: 'AMD Ryzen 5 / 16GB RAM / 512GB SSD / Ubuntu 24.04', status: ComputerStatus.Reserved, laboratory: networks }),
  new Computer({ id: 7, code: 'PC-15', specs: 'Intel i9 / 32GB RAM / 1TB SSD / Windows 11', status: ComputerStatus.Available, laboratory: programming }),
  new Computer({ id: 8, code: 'PC-16', specs: 'Intel i9 / 32GB RAM / 1TB SSD / Windows 11', status: ComputerStatus.InUse, laboratory: programming }),
  new Computer({ id: 9, code: 'PC-19', specs: 'Intel i5 / 16GB RAM / 512GB SSD / Fedora 41', status: ComputerStatus.Available, laboratory: systems }),
  new Computer({ id: 10, code: 'PC-20', specs: 'Intel i5 / 16GB RAM / 512GB SSD / Fedora 41', status: ComputerStatus.Available, laboratory: systems }),
];

const publicUser = (user: User): User =>
  new User({ id: user.id, name: user.name, email: user.email, role: user.role });

const daysFromToday = (days: number, hour: number): string => {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() + days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
};

const year = new Date().getUTCFullYear();
const [, ana] = usersSeed;

export const reservationsSeed: Reservation[] = [
  new Reservation({
    id: 1,
    code: `RES-${year}-00001`,
    topic: 'Práctica de consultas SQL',
    description: 'Ejercicios de JOIN y subconsultas.',
    start_time: daysFromToday(-3, 16),
    end_time: daysFromToday(-3, 18),
    status: Status.Completed,
    user: publicUser(ana),
    computer: computersSeed[2],
  }),
  new Reservation({
    id: 2,
    code: `RES-${year}-00002`,
    topic: 'Desarrollo de aplicación web para gestión de inventarios',
    description: 'Desarrollo y pruebas de funcionalidades del sistema.',
    start_time: daysFromToday(2, 18),
    end_time: daysFromToday(2, 19),
    status: Status.Reserved,
    user: publicUser(ana),
    computer: computersSeed[2],
  }),
  new Reservation({
    id: 3,
    code: `RES-${year}-00003`,
    topic: 'Configuración de VLAN',
    description: null,
    start_time: daysFromToday(1, 15),
    end_time: daysFromToday(1, 17),
    status: Status.Reserved,
    user: publicUser(usersSeed[0]),
    computer: computersSeed[5],
  }),
];

export const commentsSeed: Comment[] = [
  new Comment({
    id: 1,
    message: 'No enciende el equipo.',
    type: TypeMessage.Issue,
    status: IncidentStatus.Open,
    user: publicUser(usersSeed[0]),
    computer: computersSeed[3],
  }),
];
