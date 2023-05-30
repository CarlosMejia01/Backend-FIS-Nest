import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../commons/entities/base-entity.entity';
import { OPCION_GRADO } from '../constants';
import { Archivo } from '../../archivos/entities/archivo.entity';

@Entity('proyectos')
export class Proyecto extends BaseEntity {
  @ApiProperty({ uniqueItems: true })
  @Column({
    primary: true,
    type: 'uuid',
  })
  idProyecto: string;

  @ApiProperty()
  @Column()
  idReferencia: string;

  @ApiProperty({ enum: OPCION_GRADO })
  @Column({
    type: 'varchar',
    enum: OPCION_GRADO,
  })
  opcionGrado: OPCION_GRADO;

  @ApiProperty({
    description: 'Estado del proyecto en la plataforma',
    default: true,
  })
  @Column({
    type: 'bool',
    default: true,
  })
  estado: boolean;

  @ApiProperty({ description: 'Titulo del proyecto' })
  @Column()
  titulo: string;

  @OneToMany(() => Archivo, (archivo) => archivo.proyecto)
  archivos: Archivo[];
}
