import { Logger, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
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
  //
  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Futbol API')
      .setDescription('API para gestión de partidos de fútbol')
      .setVersion('1.0')
      .addBearerAuth(
        {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          in: 'header',
        },
        'JWT',
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document, {
      swaggerOptions: {
        persistAuthorization: true, // mantiene el token entre recargas
      },
    });

    logger.log('Swagger disponible en http://localhost:3000/docs');
  }

  app.enableShutdownHooks();
  app.enableCors({
    origin: '*',
    methods: '*',
    allowedHeaders: '*',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000, '0.0.0.0');
}
bootstrap()
  .then(() => logger.log(`App running on port ${process.env.PORT ?? 3000}`))
  .catch((e) => logger.error(`Error bootstrapping app, ${e}`));
