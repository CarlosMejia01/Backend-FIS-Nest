import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNumber, IsString } from 'class-validator';
import { TIPO_SOLICITUD } from '../constants';

export class CreateSolicitudesDto {
  @ApiProperty({ description: 'Agregar contenido a la solicitud' })
  @IsString()
  descripcion: string;

  @ApiProperty({ description: 'Nombres' })
  @IsString()
  nombres: string;

  @ApiProperty({ description: 'Apellidos' })
  @IsString()
  apellidos: string;

  @ApiProperty({ enum: TIPO_SOLICITUD })
  @IsEnum(TIPO_SOLICITUD)
  tipoSolicitud: TIPO_SOLICITUD;

  @ApiProperty({ example: 'Cambio de director' })
  @IsString()
  asunto: string;

  @ApiProperty({ example: 'Respuesta de la carta' })
  @IsString()
  archivoCarta: string;

  @ApiProperty({ example: 123456789 })
  @IsNumber()
  usuariosSolicitudesDocumentos: number;
}
