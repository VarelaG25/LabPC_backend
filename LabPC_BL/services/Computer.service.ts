import type {
  ComputerDto,
  ComputerRequestDto,
  IComputerRepository,
  IComputerService,
  ILaboratoryRepository,
} from '../../Application';
import { Messages, Result } from '../../Application';
import { Computer, ComputerStatus, type Contract, type Laboratory } from '../../Domain';
import { isEnumValue, isValidId, toComputerDto, toListContract, toObjectContract } from './Mappers';

export class ComputerService implements IComputerService {
  constructor(
    private readonly computerRepository: IComputerRepository,
    private readonly laboratoryRepository: ILaboratoryRepository,
  ) {}

  async getAll(laboratoryId?: number): Promise<Result<Contract<ComputerDto>>> {
    if (laboratoryId !== undefined && !isValidId(laboratoryId)) {
      return Result.failure(Messages.InvalidId);
    }

    const computers =
      laboratoryId === undefined
        ? await this.computerRepository.findAll()
        : await this.computerRepository.findByLaboratory(laboratoryId);
    const laboratories = await this.laboratoryRepository.findAll();

    return Result.success(
      toListContract(
        computers.map((computer) => toComputerDto(computer, this.findLaboratory(laboratories, computer))),
        'OK',
      ),
    );
  }

  async getById(id: number): Promise<Result<Contract<ComputerDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const computer = await this.computerRepository.findById(id);
    if (!computer) {
      return Result.failure(Messages.ComputerNotFound);
    }

    const laboratory = computer.laboratory
      ? await this.laboratoryRepository.findById(computer.laboratory.id)
      : null;
    return Result.success(toObjectContract(toComputerDto(computer, laboratory), computer.id, 'OK'));
  }

  async create(request: ComputerRequestDto): Promise<Result<Contract<ComputerDto>>> {
    const validation = await this.validate(request);
    if (typeof validation === 'string') {
      return Result.failure(validation);
    }

    const computer = await this.computerRepository.create(
      new Computer({
        code: request.code.trim().toUpperCase(),
        specs: request.specs?.trim() || null,
        status: request.status ?? ComputerStatus.Available,
        laboratory: validation,
      }),
    );

    return Result.success(
      toObjectContract(toComputerDto(computer), computer.id, 'Equipo creado correctamente.'),
    );
  }

  async update(id: number, request: ComputerRequestDto): Promise<Result<Contract<ComputerDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const computer = await this.computerRepository.findById(id);
    if (!computer) {
      return Result.failure(Messages.ComputerNotFound);
    }

    const validation = await this.validate(request, id);
    if (typeof validation === 'string') {
      return Result.failure(validation);
    }

    computer.code = request.code.trim().toUpperCase();
    computer.specs = request.specs?.trim() || null;
    computer.status = request.status ?? computer.status;
    computer.laboratory = validation;
    computer.changeControl.modified_date = new Date().toISOString();

    const updated = await this.computerRepository.update(computer);
    return updated
      ? Result.success(
          toObjectContract(toComputerDto(updated), updated.id, 'Equipo actualizado correctamente.'),
        )
      : Result.failure(Messages.ComputerNotFound);
  }

  async remove(id: number): Promise<Result<Contract<ComputerDto>>> {
    if (!isValidId(id)) {
      return Result.failure(Messages.InvalidId);
    }

    const computer = await this.computerRepository.findById(id);
    if (!computer) {
      return Result.failure(Messages.ComputerNotFound);
    }

    computer.changeControl = {
      ...computer.changeControl,
      active: 0,
      eliminated: 1,
      modified_date: new Date().toISOString(),
    };
    await this.computerRepository.update(computer);

    return Result.success(
      toObjectContract(toComputerDto(computer), computer.id, 'Equipo eliminado correctamente.'),
    );
  }

  private async validate(
    request: ComputerRequestDto,
    currentId?: number,
  ): Promise<Laboratory | string> {
    if (!request?.code?.trim() || request.laboratoryId === undefined) {
      return Messages.RequiredFields;
    }

    if (request.status !== undefined && !isEnumValue(ComputerStatus, request.status)) {
      return Messages.ComputerStatusInvalid;
    }

    if (!isValidId(request.laboratoryId)) {
      return Messages.InvalidId;
    }

    const laboratory = await this.laboratoryRepository.findById(request.laboratoryId);
    if (!laboratory) {
      return Messages.LaboratoryNotFound;
    }

    const duplicated = await this.computerRepository.findByCode(request.code);
    return duplicated && duplicated.id !== currentId ? Messages.ComputerDuplicated : laboratory;
  }

  private findLaboratory(laboratories: Laboratory[], computer: Computer): Laboratory | null {
    return laboratories.find((laboratory) => laboratory.id === computer.laboratory?.id) ?? null;
  }
}
