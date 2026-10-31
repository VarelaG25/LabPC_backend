import type {
  IComputerRepository,
  ILaboratoryRepository,
  ILaboratoryService,
  LaboratoryDto,
  LaboratoryRequestDto,
} from '../../Application';
import { Messages, Result } from '../../Application';
import { Laboratory, type Contract } from '../../Domain';
import { isValidId, toLaboratoryDto, toListContract, toObjectContract } from './Mappers';

export class LaboratoryService implements ILaboratoryService {
  constructor(
    private readonly laboratoryRepository: ILaboratoryRepository,
    private readonly computerRepository: IComputerRepository,
  ) {}

  async getAll(): Promise<Result<Contract<LaboratoryDto>>> {
    const laboratories = await this.laboratoryRepository.findAll();
    return Result.success(toListContract(laboratories.map(toLaboratoryDto), 'OK'));
  }

  async getById(id: number): Promise<Result<Contract<LaboratoryDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const laboratory = await this.laboratoryRepository.findById(id);
    return laboratory
      ? Result.success(toObjectContract(toLaboratoryDto(laboratory), laboratory.id, 'OK'))
      : Result.failure(Messages.LaboratoryNotFound);
  }

  async create(request: LaboratoryRequestDto): Promise<Result<Contract<LaboratoryDto>>> {
    const validation = await this.validate(request);
    if (validation) {
      return Result.failure(validation);
    }

    const laboratory = await this.laboratoryRepository.create(
      new Laboratory({
        name: request.name.trim(),
        location: request.location?.trim() || null,
        capacity: request.capacity ?? 0,
      }),
    );

    return Result.success(
      toObjectContract(toLaboratoryDto(laboratory), laboratory.id, 'Laboratorio creado correctamente.'),
    );
  }

  async update(id: number, request: LaboratoryRequestDto): Promise<Result<Contract<LaboratoryDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const laboratory = await this.laboratoryRepository.findById(id);
    if (!laboratory) {
      return Result.failure(Messages.LaboratoryNotFound);
    }

    const validation = await this.validate(request, id);
    if (validation) {
      return Result.failure(validation);
    }

    laboratory.name = request.name.trim();
    laboratory.location = request.location?.trim() || null;
    laboratory.capacity = request.capacity ?? laboratory.capacity;
    laboratory.changeControl.modified_date = new Date().toISOString();

    const updated = await this.laboratoryRepository.update(laboratory);
    return updated
      ? Result.success(
          toObjectContract(toLaboratoryDto(updated), updated.id, 'Laboratorio actualizado correctamente.'),
        )
      : Result.failure(Messages.LaboratoryNotFound);
  }

  async remove(id: number): Promise<Result<Contract<LaboratoryDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const laboratory = await this.laboratoryRepository.findById(id);
    if (!laboratory) {
      return Result.failure(Messages.LaboratoryNotFound);
    }

    if ((await this.computerRepository.findByLaboratory(id)).length > 0) {
      return Result.failure(Messages.LaboratoryHasComputers);
    }

    laboratory.changeControl = {
      ...laboratory.changeControl,
      active: 0,
      eliminated: 1,
      modified_date: new Date().toISOString(),
    };
    await this.laboratoryRepository.update(laboratory);

    return Result.success(
      toObjectContract(toLaboratoryDto(laboratory), laboratory.id, 'Laboratorio eliminado correctamente.'),
    );
  }

  private async validate(request: LaboratoryRequestDto, currentId?: number): Promise<string | null> {
    if (!request?.name?.trim()) {
      return Messages.RequiredFields;
    }

    if (
      request.capacity !== undefined &&
      (!Number.isInteger(request.capacity) || request.capacity < 0)
    ) {
      return 'La capacidad del laboratorio no es válida.';
    }

    const duplicated = await this.laboratoryRepository.findByName(request.name);
    return duplicated && duplicated.id !== currentId ? Messages.LaboratoryDuplicated : null;
  }
}
