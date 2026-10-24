import { ChangeControl, Computer, IBase, IncidentStatus, TypeMessage, User } from '../../index';

export class Comment implements IBase {
  id: number = 0;
  message: string | null = null;
  type?: TypeMessage;
  status?: IncidentStatus;

  user?: User;
  computer?: Computer;
  changeControl: ChangeControl;

  constructor(value: Partial<Comment> = {}) {
    this.changeControl = new ChangeControl();
    Object.assign(this, value);
  }
}
