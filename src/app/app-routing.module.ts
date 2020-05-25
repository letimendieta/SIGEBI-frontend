import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './general/layouts/default/default.component';
import { PersonasComponent } from './vistas/listas/personas/personas.component';
import { PersonaComponent } from './vistas/formularios/persona/persona.component';
import { PacientesComponent } from './vistas/listas/pacientes/pacientes.component';
import { PacienteComponent } from './vistas/formularios/paciente/paciente.component';

const routes: Routes = [{
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
