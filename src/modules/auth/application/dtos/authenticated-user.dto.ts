import { Role } from 'src/modules/roles/domain/enums/Role';

export class AuthenticatedUserDto {
  constructor(
    readonly id: string,
    readonly username: string,
    readonly role: Role,
  ) {}
}
