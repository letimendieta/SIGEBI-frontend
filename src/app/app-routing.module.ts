import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DefaultComponent } from './general/layouts/default/default.component';
import { PersonasComponent } from './vistas/listas/personas/personas.component';
import { PersonaComponent } from './vistas/formularios/persona/persona.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [{
    path: 'personas',
    component: PersonasComponent
  }, {
    path: 'persona/:id',
    component: PersonaComponent
  }]
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
