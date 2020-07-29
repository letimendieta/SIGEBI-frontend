import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './general/layouts/default/default.component';
import { LoginComponent } from './vistas/formularios/login/login.component';
import { PersonasComponent } from './vistas/listas/personas/personas.component';
import { PersonaComponent } from './vistas/formularios/persona/persona.component';
import { PacientesComponent } from './vistas/listas/pacientes/pacientes.component';
import { PacienteComponent } from './vistas/formularios/paciente/paciente.component';
import { FuncionariosComponent } from './vistas/listas/funcionarios/funcionarios.component';
import { FuncionarioComponent } from './vistas/formularios/funcionario/funcionario.component';
import { AuthGuard } from './guards/auth.guard';
import { ParametrosComponent } from './vistas/listas/parametros/parametros.component';
import { ParametroComponent } from './vistas/formularios/parametro/parametro.component';
import { ProcedimientosComponent } from './vistas/listas/procedimientos/procedimientos.component';
import { ProcedimientoComponent } from './vistas/formularios/procedimiento/procedimiento.component';
import { UsuariosComponent } from './vistas/listas/usuarios/usuarios.component';
import { UsuarioComponent } from './vistas/formularios/usuario/usuario.component';
import { AreasComponent } from './vistas/listas/areas/areas.component';
import { AreaComponent } from './vistas/formularios/area/area.component';
import { CarrerasComponent } from './vistas/listas/carreras/carreras.component';
import { CarreraComponent } from './vistas/formularios/carrera/carrera.component';
import { DepartamentosComponent } from './vistas/listas/departamentos/departamentos.component';
import { DepartamentoComponent } from './vistas/formularios/departamento/departamento.component';
import { DependenciaComponent } from './vistas/formularios/dependencia/dependencia.component';
import { DependenciasComponent } from './vistas/listas/dependencias/dependencias.component';
import { EstamentoComponent } from './vistas/formularios/estamento/estamento.component';
import { EstamentosComponent } from './vistas/listas/estamentos/estamentos.component';
import { CitaComponent } from './vistas/formularios/cita/cita.component';
import { CitasComponent } from './vistas/listas/citas/citas.component';
import { HorarioComponent } from './vistas/formularios/horario/horario.component';
import { HorariosComponent } from './vistas/listas/horarios/horarios.component';
import { StockComponent } from './vistas/formularios/stock/stock.component';
import { StocksComponent } from './vistas/listas/stocks/stocks.component';
import { InsumoComponent } from './vistas/formularios/insumo/insumo.component';
import { InsumosComponent } from './vistas/listas/insumos/insumos.component';
import { HistorialesClinicosComponent } from 'src/app/vistas/listas/historialesClinicos/historialesClinicos.component';
import { HistorialClinicoComponent } from 'src/app/vistas/formularios/historialClinico/historialClinico.component';
import { UploadFilesComponent } from 'src/app/vistas/upload-files/upload-files.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
  path: '',
  component: DefaultComponent,
  children: [
  {
    path: 'personas',
    component: PersonasComponent
  },{
    path: 'persona/:id',
    component: PersonaComponent
  },
  {
    path: 'pacientes',
    component: PacientesComponent
  },{
    path: 'paciente/:id',
    component: PacienteComponent
  },
  {
    path: 'funcionarios',
    component: FuncionariosComponent
  },{
    path: 'funcionario/:id',
    component: FuncionarioComponent
  },
  {
    path: 'parametros',
    component: ParametrosComponent
  },{
    path: 'parametro/:id',
    component: ParametroComponent
  },
  {
    path: 'procedimientos',
    component: ProcedimientosComponent
  },{
    path: 'procedimiento/:id',
    component: ProcedimientoComponent
  },
  {
    path: 'usuarios',
    component: UsuariosComponent
  },{
    path: 'usuario/:id',
    component: UsuarioComponent
  },
  {
    path: 'areas',
    component: AreasComponent
  },{
    path: 'area/:id',
    component: AreaComponent
  },
  {
    path: 'carreras',
    component: CarrerasComponent
  },{
    path: 'carrera/:id',
    component: CarreraComponent
  },
  {
    path: 'departamentos',
    component: DepartamentosComponent
  },{
    path: 'departamento/:id',
    component: DepartamentoComponent
  },
  {
    path: 'dependencias',
    component: DependenciasComponent
  },{
    path: 'dependencia/:id',
    component: DependenciaComponent
  },
  {
    path: 'estamentos',
    component: EstamentosComponent
  },{
    path: 'estamento/:id',
    component: EstamentoComponent
  },
  {
    path: 'citas',
    component: CitasComponent
  },{
    path: 'cita/:id',
    component: CitaComponent
  },
  {
    path: 'horarios',
    component: HorariosComponent
  },{
    path: 'horario/:id',
    component: HorarioComponent
  },
  {
    path: 'stocks',
    component: StocksComponent
  },{
    path: 'stock/:id',
    component: StockComponent
  },
  {
    path: 'insumos',
    component: InsumosComponent
  },{
    path: 'insumo/:id',
    component: InsumoComponent
  },
  {
    path: 'historialesClinicos',
    component: HistorialesClinicosComponent
  },{
    path: 'historialClinico/:id',
    component: HistorialClinicoComponent
  },{
    path: 'upload-files',
    component: UploadFilesComponent
  }
  ]
}];



@NgModule({
  imports: [
    RouterModule.forRoot( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
