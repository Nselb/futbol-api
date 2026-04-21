import { AuthenticatedUserDto } from 'src/modules/auth/application/dtos/authenticated-user.dto';

export type AuthenticatedRequest = Request & { user: AuthenticatedUserDto };
