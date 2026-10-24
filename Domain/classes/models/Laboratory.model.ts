import { ChangeControl, IBase } from '../../index';

export class Laboratory implements IBase {
  id: number = 0;
  name: string | null = null;
  location: string | null = null;
  capacity: number = 0;
  changeControl: ChangeControl;

  constructor(values: Partial<Laboratory> = {}) {
    this.changeControl = new ChangeControl();
    Object.assign(this, values);
  }
}
