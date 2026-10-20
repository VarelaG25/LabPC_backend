import { ChangeControl, Computer, IBase, Status, User } from '../../index';

export class Reservation implements IBase {
  id: number = 0;
  start_time: string | null = null;
  end_time: string | null = null;
  status: Status = Status.None;

  user?: User;
  computer?: Computer;
  changeControl: ChangeControl;

  constructor(value: Partial<Reservation> = {}) {
    this.changeControl = new ChangeControl();
    Object.assign(value, this);
  }
}
