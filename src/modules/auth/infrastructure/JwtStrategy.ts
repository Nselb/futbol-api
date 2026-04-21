import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { AuthenticatedUserDto } from '../application/dtos/authenticated-user.dto';
import { JwtPayloadDto } from '../application/dtos/jwt-payload.dto';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(config: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: config.get('JWT_SECRET') ?? '',
    });
  }

  validate(payload: JwtPayloadDto): AuthenticatedUserDto {
    return new AuthenticatedUserDto(
      payload.sub,
      payload.username,
      payload.role,
    );
  }
}
