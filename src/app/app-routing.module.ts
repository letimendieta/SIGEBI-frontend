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
import { ParametrosComponent } from './vistas/listas/parametros/parametros.component';
import { ParametroComponent } from './vistas/formularios/parametro/parametro.component';
import { ProcedimientosComponent } from './vistas/listas/procedimientos/procedimientos.component';
import { ProcedimientoComponent } from './vistas/formularios/procedimiento/procedimiento.component';
import { UsuariosComponent } from './vistas/listas/usuarios/usuarios.component';
import { UsuarioComponent } from './vistas/formularios/usuario/usuario.component';
import { AreasComponent } from './vistas/listas/areas/areas.component';
import { AreaComponent } from './vistas/formularios/area/area.component';
import { MotivosConsultaComponent } from './vistas/listas/motivosConsulta/motivosConsulta.component';
import { MotivoConsultaComponent } from './vistas/formularios/motivoConsulta/motivoConsulta.component';
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
import { SignosVitalesComponent } from 'src/app/vistas/listas/signosVitales/signosVitales.component';
import { SignoVitalComponent } from 'src/app/vistas/formularios/signoVital/signoVital.component';
import { EnfermedadesCie10Component } from 'src/app/vistas/listas/enfermedadesCie10/enfermedadesCie10.component';
import { EnfermedadCie10Component } from 'src/app/vistas/formularios/enfermedadCie10/enfermedadCie10.component';
import { ConsultorioComponent } from 'src/app/vistas/formularios/consultorio/consultorio.component';
import { EnfermeriaComponent } from 'src/app/vistas/formularios/enfermeria/enfermeria.component';

import { PersonasGuardService as guard } from 'src/app/guards/personas-guard.service';


const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
  path: '',
  component: DefaultComponent,
  children: [
  {
    path: 'personas',canActivate: [guard], data: { expectedRol: ['admin', 'user'] },
    component: PersonasComponent
  },{
    path: 'persona/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: PersonaComponent
  },
  {
    path: 'pacientes',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: PacientesComponent
  },{
    path: 'paciente/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: PacienteComponent
  },
  {
    path: 'funcionarios',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: FuncionariosComponent
  },{
    path: 'funcionario/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: FuncionarioComponent
  },
  {
    path: 'parametros',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: ParametrosComponent
  },{
    path: 'parametro/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: ParametroComponent
  },
  {
    path: 'procedimientos',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: ProcedimientosComponent
  },{
    path: 'procedimiento/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: ProcedimientoComponent
  },
  {
    path: 'usuarios',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: UsuariosComponent
  },{
    path: 'usuario/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: UsuarioComponent
  },
  {
    path: 'areas',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: AreasComponent
  },{
    path: 'area/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: AreaComponent
  },
  {
    path: 'carreras',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: CarrerasComponent
  },{
    path: 'carrera/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: CarreraComponent
  },
  {
    path: 'departamentos',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: DepartamentosComponent
  },{
    path: 'departamento/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: DepartamentoComponent
  },
  {
    path: 'dependencias',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: DependenciasComponent
  },{
    path: 'dependencia/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: DependenciaComponent
  },
  {
    path: 'estamentos',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: EstamentosComponent
  },{
    path: 'estamento/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: EstamentoComponent
  },
  {
    path: 'citas',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: CitasComponent
  },{
    path: 'cita/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: CitaComponent
  },
  {
    path: 'horarios',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: HorariosComponent
  },{
    path: 'horario/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: HorarioComponent
  },
  {
    path: 'stocks',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: StocksComponent
  },{
    path: 'stock/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: StockComponent
  },
  {
    path: 'insumos',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: InsumosComponent
  },{
    path: 'insumo/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: InsumoComponent
  },
  {
    path: 'historialesClinicos',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: HistorialesClinicosComponent
  },{
    path: 'historialClinico/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: HistorialClinicoComponent
  },
  {
    path: 'consultorio',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: ConsultorioComponent
  },
  {
    path: 'enfermeria',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: EnfermeriaComponent
  },
  {
    path: 'motivosConsulta',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: MotivosConsultaComponent
  },{
    path: 'motivoConsulta/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: MotivoConsultaComponent
  },
  {
    path: 'signosVitales',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: SignosVitalesComponent
  },{
    path: 'signoVital/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: SignoVitalComponent
  },
  {
    path: 'enfermedadesCie10',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: EnfermedadesCie10Component
  },{
    path: 'enfermedadCie10/:id',canActivate: [guard], data: { expectedRol: ['admin'] },
    component: EnfermedadCie10Component
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
