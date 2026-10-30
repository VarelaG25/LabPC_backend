import type { ILaboratoryRepository } from '../../Application';
import { Laboratory } from '../../Domain';
import type { IDataContext } from '../context/IDataContext';

export class LaboratoryRepository implements ILaboratoryRepository {
  constructor(private readonly context: IDataContext<Laboratory>) {}

  async findAll(): Promise<Laboratory[]> {
    const laboratories = await this.context.find();
    return laboratories.filter((laboratory) => laboratory.changeControl?.eliminated !== 1);
  }

  async findById(id: number): Promise<Laboratory | null> {
    const laboratory = await this.context.findOne({ id });
    return laboratory && laboratory.changeControl?.eliminated !== 1 ? laboratory : null;
  }

  async findByName(name: string): Promise<Laboratory | null> {
    const normalizedName = name.trim().toLowerCase();
    const laboratories = await this.findAll();
    return (
      laboratories.find((laboratory) => laboratory.name?.toLowerCase() === normalizedName) ?? null
    );
  }

  async create(laboratory: Laboratory): Promise<Laboratory> {
    laboratory.id = await this.context.nextId();
    return this.context.insertOne(laboratory);
  }

  async update(laboratory: Laboratory): Promise<Laboratory | null> {
    return this.context.updateOne({ id: laboratory.id }, { $set: { ...laboratory } });
  }
}
