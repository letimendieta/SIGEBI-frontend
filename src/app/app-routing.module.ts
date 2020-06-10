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

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  {
  path: '',
  component: DefaultComponent,canActivate: [ AuthGuard ],
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
