import { Role } from 'src/modules/roles/domain/enums/Role';

export class User {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly password: string,
    readonly name: string,
    readonly role: Role,
    readonly createdAt: Date = new Date(),
  ) {}
}
