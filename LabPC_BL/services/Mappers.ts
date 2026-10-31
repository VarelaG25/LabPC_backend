import type {
  ComputerDto,
  LaboratoryDto,
  UserDto,
} from '../../Application';
import {
  Contract,
  RespOp,
  type Computer,
  type Laboratory,
  type User,
} from '../../Domain';

export function toUserDto(user: User): UserDto {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

export function toLaboratoryDto(laboratory: Laboratory): LaboratoryDto {
  return {
    id: laboratory.id,
    name: laboratory.name,
    location: laboratory.location ?? null,
    capacity: laboratory.capacity ?? 0,
    created_date: laboratory.changeControl?.created_date ?? null,
  };
}

export function toComputerDto(computer: Computer, laboratory?: Laboratory | null): ComputerDto {
  const currentLaboratory = laboratory ?? computer.laboratory ?? null;
  return {
    id: computer.id,
    code: computer.code,
    specs: computer.specs ?? null,
    status: computer.status,
    laboratoryId: currentLaboratory?.id ?? null,
    laboratory: currentLaboratory ? toLaboratoryDto(currentLaboratory) : null,
    created_date: computer.changeControl?.created_date ?? null,
  };
}

export function toObjectContract<T>(value: T, id: number, message: string): Contract<T> {
  const contract = new Contract<T>();
  contract.RespOp = RespOp.Ok;
  contract.Object = value;
  contract.ObjectId = id;
  contract.Response = message;
  contract.Total = 1;
  return contract;
}

export function toListContract<T>(values: T[], message: string): Contract<T> {
  const contract = new Contract<T>();
  contract.RespOp = RespOp.Ok;
  contract.ObjectList = values;
  contract.Response = message;
  contract.Total = values.length;
  return contract;
}

export function isValidId(id: unknown): id is number {
  return Number.isInteger(id) && (id as number) > 0;
}

export function isEnumValue<T extends Record<string, string | number>>(
  enumeration: T,
  value: unknown,
): boolean {
  return Object.values(enumeration).includes(value as T[keyof T]) && value !== 0;
}
