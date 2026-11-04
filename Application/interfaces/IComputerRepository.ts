import type { Computer } from '../../Domain';

export interface IComputerRepository {
  findAll(): Promise<Computer[]>;
  findById(id: number): Promise<Computer | null>;
  findByCode(code: string): Promise<Computer | null>;
  findByLaboratory(laboratoryId: number): Promise<Computer[]>;
  create(computer: Computer): Promise<Computer>;
  update(computer: Computer): Promise<Computer | null>;
}
