import { ChangeControl, Computer, IBase, TypeMessage, User } from '../../index';

export class Comment implements IBase {
  id: number = 0;
  message: string | null = null;
  type?: TypeMessage;

  user?: User;
  computer?: Computer;
  changeControl: ChangeControl;

  constructor(value: Partial<Comment> = {}) {
    this.changeControl = new ChangeControl();
    Object.assign(value, this);
  }
}
