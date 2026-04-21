import { Role } from 'src/modules/roles/domain/enums/Role';

export class JwtPayloadDto {
  constructor(
    readonly sub: string,
    readonly username: string,
    readonly role: Role,
  ) {}
}
