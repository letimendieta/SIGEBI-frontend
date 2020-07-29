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
