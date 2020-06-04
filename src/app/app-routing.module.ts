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

const routes: Routes = [
  { path: 'login', component: LoginComponent},
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  {
  path: 'inicio',
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
