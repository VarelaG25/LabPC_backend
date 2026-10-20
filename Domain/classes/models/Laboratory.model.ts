import { ChangeControl, IBase } from '../../index';

export class Laboratory implements IBase {
  id: number = 0;
  name: string | null = null;
  changeControl: ChangeControl;

  constructor(values: Partial<Laboratory> = {}) {
    this.changeControl = new ChangeControl();
    Object.assign(values, this);
  }
}
