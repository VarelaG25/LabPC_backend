import type { IComputerRepository } from '../../Application';
import { Computer } from '../../Domain';
import type { IDataContext } from '../context/IDataContext';

export class ComputerRepository implements IComputerRepository {
  constructor(private readonly context: IDataContext<Computer>) {}

  async findAll(): Promise<Computer[]> {
    const computers = await this.context.find();
    return computers.filter((computer) => computer.changeControl?.eliminated !== 1);
  }

  async findById(id: number): Promise<Computer | null> {
    const computer = await this.context.findOne({ id });
    return computer && computer.changeControl?.eliminated !== 1 ? computer : null;
  }

  async findByCode(code: string): Promise<Computer | null> {
    const normalizedCode = code.trim().toUpperCase();
    const computers = await this.findAll();
    return computers.find((computer) => computer.code?.toUpperCase() === normalizedCode) ?? null;
  }

  async findByLaboratory(laboratoryId: number): Promise<Computer[]> {
    const computers = await this.findAll();
    return computers.filter((computer) => computer.laboratory?.id === laboratoryId);
  }

  async create(computer: Computer): Promise<Computer> {
    computer.id = await this.context.nextId();
    return this.context.insertOne(computer);
  }

  async update(computer: Computer): Promise<Computer | null> {
    return this.context.updateOne({ id: computer.id }, { $set: { ...computer } });
  }
}
