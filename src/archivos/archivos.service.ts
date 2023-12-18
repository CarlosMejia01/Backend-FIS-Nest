import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { existsSync } from 'fs';
import { join } from 'path';
import { Repository } from 'typeorm';
import { DBExceptionService } from '../commons/services/db-exception.service';
import { CreateArchivoDto } from './dto/create-archivo.dto';
import { UpdateArchivoDto } from './dto/update-archivo.dto';
import { Archivo } from './entities/archivo.entity';
import * as fs from 'fs';
import { EntregasService } from '../entregas/entregas.service';
import { SolicitudesService } from '../solicitudes/solicitudes.service';
import { Proyecto } from '../proyectos/entities/proyecto.entity';
import { UsuariosProyectos } from '../auth/entities/usuarios-proyectos.entity';

@Injectable()
export class ArchivosService {
  constructor(
    @InjectRepository(Archivo)
    private readonly archivosRepo: Repository<Archivo>,
    @InjectRepository(Proyecto)
    private readonly proyectosRepo: Repository<Proyecto>,
    @InjectRepository(UsuariosProyectos)
    private readonly usuariosProyectosRepo: Repository<UsuariosProyectos>,
    private readonly entregasService: EntregasService,
    private readonly solicitudesService: SolicitudesService,
  ) {}

  async crearArchivo(
    idEntrega: string,
    createArchivoDto: CreateArchivoDto,
  ): Promise<Archivo> {
    // Verificar que la entrega exista
    const entrega = await this.entregasService.findOne(idEntrega);

    if (!entrega) {
      throw new NotFoundException(
        `No se encontró la entrega con ID ${idEntrega}`,
      );
    }

    // Archivo asociado a la entrega
    try {
      const archivo = this.archivosRepo.create({
        ...createArchivoDto,
        entregas: entrega,
      });

      const nuevoArchivo = await this.archivosRepo.save(archivo);

      // Asociar el archivo a la entrega
      entrega.archivos.push(nuevoArchivo);
      await this.entregasService.save(entrega);

      // Obtener el proyecto asociado a la entrega
      const proyecto = await this.proyectosRepo
        .createQueryBuilder('proyecto')
        .leftJoinAndSelect('proyecto.entregas', 'entregas')
        .where('entregas.idEntrega = :idEntrega', {
          idEntrega: entrega.idEntrega,
        })
        .getOne();

      // Realizar cualquier lógica adicional según sea necesario

      return nuevoArchivo;
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  async crearArchivoSolicitud(
    createArchivoDto: CreateArchivoDto,
  ): Promise<Archivo> {
    const { idSolicitud, ...restoDto } = createArchivoDto;

    // Verifica que la solicitud exista
    const solicitud = await this.solicitudesService.findOne(idSolicitud);

    if (!solicitud) {
      throw new NotFoundException(
        `No se encontró la solicitud con ID ${idSolicitud}`,
      );
    }

    // Archivo asociado a la solicitud
    try {
      const archivo = this.archivosRepo.create({
        ...restoDto,
        solicitud: solicitud,
      });

      const nuevoArchivo = await this.archivosRepo.save(archivo);

      return nuevoArchivo;
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }

  getStaticProyecto(nombreProyecto: string) {
    const path = join(__dirname, '../../static/proyectos', nombreProyecto);
    if (!existsSync(path))
      throw new BadRequestException(
        `No se encontro ningun archivo ${nombreProyecto}`,
      );
    return path;
  }

  getStaticSolicitud(nombreSolicitud: string) {
    const path = join(__dirname, '../../static/solicitudes', nombreSolicitud);
    if (!existsSync(path))
      throw new BadRequestException(
        `No se encontro ningun archivo ${nombreSolicitud}`,
      );
    return path;
  }

  getArchivosPdfDocx() {
    const rutaCarpetaArchivos = join(__dirname, '../../static/proyectos');
    const archivos = fs.readdirSync(rutaCarpetaArchivos);
    const archivosFiltrados = archivos.filter(
      (archivo) => archivo.endsWith('.pdf') || archivo.endsWith('.docx'),
    );

    if (archivosFiltrados.length === 0) {
      throw new NotFoundException('No se encontraron archivos PDF o DOCX.');
    }

    return archivosFiltrados;
  }

  async findAll() {
    const archivos = await this.archivosRepo.find();

    if (!archivos || !archivos.length)
      throw new NotFoundException('No se encontraron resultados');

    return archivos;
  }

  async findOne(idArchivo: string) {
    const archivo = await this.archivosRepo.findOne({
      where: { idArchivo },
      relations: { solicitud: true, entregas: true },
    });

    if (!archivo)
      throw new NotFoundException(
        `No se encontraron resultados para el archivo "${idArchivo}"`,
      );

    return archivo;
  }

  async getArchivoById(idArchivo: string): Promise<Archivo> {
    const archivo = await this.archivosRepo.findOne({ where: { idArchivo } });

    if (!archivo) {
      throw new NotFoundException(
        `No se encontró ningún archivo con el ID ${idArchivo}`,
      );
    }

    return archivo;
  }

  async update(idArchivo: string, updateArchivoDto: UpdateArchivoDto) {
    const archivo = await this.archivosRepo.findOne({ where: { idArchivo } });
    if (!archivo) {
      throw new NotFoundException(
        `No se encontró ningún archivo con el ID ${idArchivo}`,
      );
    }

    try {
      this.archivosRepo.merge(archivo, updateArchivoDto);

      return await this.archivosRepo.save(archivo);
    } catch (error) {
      throw DBExceptionService.handleDBException(error);
    }
  }
  
  async remove(idArchivo: string) {
    const archivo = await this.archivosRepo.findOne({
      where: { idArchivo },
      withDeleted: true,
    });

    if (!archivo)
      throw new NotFoundException(
        `El archivo no existe con el id ${idArchivo}`,
      );
    return await this.archivosRepo.remove(archivo);
  }
}
