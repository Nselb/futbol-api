import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
//import { Reflector } from '@nestjs/core'
//import { JwtAuthGuard } from './shared/guards/jwtauth.guard';
//import { RolesGuard } from './shared/guards/roles.guard';

const logger = new Logger('Bootstrap');
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  //const reflector = app.get(Reflector);

  //app.useGlobalGuards(new JwtAuthGuard(reflector), new RolesGuard(reflector));

  app.enableShutdownHooks();
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap()
  .then(() => logger.log(`App running on port ${process.env.PORT ?? 3000}`))
  .catch((e) => logger.error(`Error bootstrapping app, ${e}`));
