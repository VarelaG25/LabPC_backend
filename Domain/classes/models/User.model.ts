import { ChangeControl, IBase, UserRole } from '../../index';

export class User implements IBase {
  id: number = 0;
  name: string | null = null;
  email: string | null = null;
  password: string | null = null;
  role: UserRole = UserRole.None;

  changeControl: ChangeControl;

  constructor(values: Partial<User> = {}) {
    this.changeControl = new ChangeControl();
    Object.assign(this, values);
  }
}
