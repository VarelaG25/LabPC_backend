import { RespOp } from '../../index';

export class Contract<T> {
  RespOp: RespOp | null = null;
  Object?: T;
  ObjectList?: T[];
  ObjectId: number | null = null;
  Response: string | null = null;
  Total: number | null = null;
  Error?: string | null = null;
}
