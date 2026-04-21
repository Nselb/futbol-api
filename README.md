# Futbol API

Backend REST para la gestión de usuarios, roles y autenticación de una plataforma de fútbol.

---

## Por qué Clean Architecture

NestJS ya promueve buenas prácticas con su sistema de módulos, inyección de dependencias y separación entre controladores y servicios. Clean Architecture lleva esas mismas ideas un paso más allá, dándole un nombre y una ubicación explícita a cada responsabilidad.

### Cómo se mapean los conceptos de NestJS

| NestJS convencional | Este proyecto | Responsabilidad |
|---|---|---|
| `@Controller` | `presentation/` | Recibir HTTP, validar con pipes, devolver respuesta |
| `@Injectable()` service | `application/use-cases/` | Lógica de negocio, un caso de uso por clase |
| Service con acceso a DB | `infrastructure/repositories/` | Implementación concreta de persistencia (Prisma) |
| Interface de repositorio | `domain/repositories/` | Contrato que la aplicación conoce, sin saber la DB |
| Entidad Prisma | `domain/entities/` | Objeto de dominio puro, sin decoradores de ORM |

#### Los use cases **son** servicios de NestJS

Un use case es un `@Injectable()` exactamente igual a un servicio estándar de NestJS. La diferencia está en el foco: **cada clase hace una sola cosa** (crear usuario, hacer login, etc.) en lugar de agrupar toda la lógica en un `UsersService` que crece sin límite.

```ts
// application/use-cases/CreateUserUseCase.ts
@Injectable()
export class CreateUserUseCase {
  constructor(@Inject(USER_REPO_TOKEN) private repository: IUserRepository) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> { ... }
}
```

Se registran en el módulo igual que cualquier provider y se inyectan en el controlador de la misma forma.

#### Los repositorios usan inyección de dependencias con token

En lugar de inyectar `PrismaUserRepository` directamente, el use case depende de la interfaz `IUserRepository` a través de un token (`USER_REPO_TOKEN`). El módulo decide qué implementación proveer:

```ts
// users.module.ts
providers: [
  { provide: USER_REPO_TOKEN, useClass: PrismaUserRepository },
  CreateUserUseCase,
]
```

Esto es el mismo patrón que NestJS usa internamente para cosas como `ConfigService` o `JwtService`: el consumidor no sabe quién implementa, solo qué contrato tiene.

### Beneficios concretos

- **Testear use cases** sin base de datos: basta con pasar un mock que implemente `IUserRepository`.
- **Cambiar Prisma** por otro ORM sin tocar ningún use case ni controlador.
- **Límites claros de equipo**: un cambio de schema de DB no rompe la capa de aplicación.

### Estructura de carpetas

```
src/modules/<módulo>/
├── domain/          # entidades puras, interfaces de repositorio, enums
├── application/     # use cases (@Injectable), DTOs
├── infrastructure/  # PrismaRepository, JwtStrategy, mappers
└── presentation/    # @Controller
```

---

## Stack

![NestJS](https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?style=flat-square&logo=typescript&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?style=flat-square&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-latest-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-Passport--JWT_4-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)
![bcrypt](https://img.shields.io/badge/bcrypt-6-grey?style=flat-square)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white)

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto:

```env
DATABASE_URL="postgresql://<DB_USER>:<DB_PASSWORD>@localhost:5432/<DB_NAME>"
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=futbol
JWT_SECRET=supersecret
```

---

## Iniciar en desarrollo

### 1. Levantar la base de datos

```bash
docker compose up -d
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Correr migraciones

```bash
npx prisma migrate dev
```

### 4. Iniciar el servidor

```bash
npm run start:dev
```

El servidor queda disponible en `http://localhost:3000`.

---

## Build para producción

```bash
# Compilar
npm run build

# Ejecutar el build
npm run start:prod
```

---

## Otros comandos útiles

| Comando             | Descripción                    |
| ------------------- | ------------------------------ |
| `npm run lint`      | Lint con ESLint + Prettier     |
| `npm run format`    | Formatea todos los archivos    |
| `npm test`          | Corre los tests unitarios      |
| `npm run test:cov`  | Tests con reporte de cobertura |
| `npm run test:e2e`  | Tests end-to-end               |
| `npx prisma studio` | UI visual de la base de datos  |
