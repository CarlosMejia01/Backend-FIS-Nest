import { Controller, Get } from '@nestjs/common';
import { EstadisticasService } from './estadisticas.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Estadisticas')
@Controller('estadisticas')
export class EstadisticasController {
  constructor(private readonly estadisticasService: EstadisticasService) {}

  @Get('total-proyectos-por-opcion')
  getTotalProyectosPorTipo() {
    return this.estadisticasService.getTotalProyectosPorTipo();
  }

  @Get('proyectos-por-director')
  async cuentaProyectosDocentes() {
    return this.estadisticasService.cuentaProyectosDocentes();
  }

  // @Get('proyectos/finalizados')
  // getProyectosFinalizadosPorAno() {
  //   return this.estadisticasService.getProyectosFinalizadosPorAno();
  // }

  @Get('proyectos/finalizados')
  async contarProyectosFinalizadosUltimosTresAnios(): Promise<
    { anio: number; cantidad: number }[]
  > {
    return this.estadisticasService.contarProyectosFinalizados();
  }
  @Get('proyectos-activos')
  getProyectosExcluyendoEstados() {
    return this.estadisticasService.getProyectosExcluyendoEstados();
  }
  @Get('solicitudes')
  async obtenerEstadisticasSolicitudesPorTipo() {
    const estadisticas =
      await this.estadisticasService.contarSolicitudesPorTipo();
    return estadisticas;
    //return { success: true, data: estadisticas };
  }
}
