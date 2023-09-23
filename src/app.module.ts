import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

import { ArchivosModule } from './archivos/archivos.module';
import { JoiValidationSchema } from './config';
import { NotificacionesModule } from './notificaciones/notificaciones.module';
import { NovedadesModule } from './novedades/novedades.module';
import { ProyectosModule } from './proyectos/proyectos.module';
import { SolicitudesModule } from './solicitudes/solicitudes.module';
import { AuthModule } from './auth/auth.module';
import { PasantiasModule } from './pasantias/pasantias.module';
import { EspaciosCoterminalesModule } from './espacios-coterminales/espacios-coterminales.module';

@Module({
  imports: [
    // Aplicar la validación y reconocer las variables de entorno
    ConfigModule.forRoot({
      validationSchema: JoiValidationSchema,
    }),

    // Conexión a la base de datos
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      database: process.env.DB_NAME,
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      autoLoadEntities: true,
      synchronize: true,
      namingStrategy: new SnakeNamingStrategy(),
    }),

    AuthModule,

    ProyectosModule,

    ArchivosModule,

    SolicitudesModule,

    NotificacionesModule,

    NovedadesModule,

    PasantiasModule,

    EspaciosCoterminalesModule,
  ],
})
export class AppModule {}
