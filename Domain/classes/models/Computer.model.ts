import { ChangeControl, IBase, Laboratory } from '../../index';

export class Computer implements IBase {
  id: number = 0;
  code: string | null = null;

  changeControl: ChangeControl;

  laboratory?: Laboratory;

  constructor(value: Partial<Computer> = {}) {
    this.changeControl = new ChangeControl();
    Object.assign(value, this);
  }
}
