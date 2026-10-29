import type { Laboratory } from '../../Domain';

export interface ILaboratoryRepository {
  findAll(): Promise<Laboratory[]>;
  findById(id: number): Promise<Laboratory | null>;
  findByName(name: string): Promise<Laboratory | null>;
  create(laboratory: Laboratory): Promise<Laboratory>;
  update(laboratory: Laboratory): Promise<Laboratory | null>;
}
