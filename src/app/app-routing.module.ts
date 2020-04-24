import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonasComponent } from './vistas/listas/personas/personas.component';
import { PersonaComponent } from './vistas/formularios/persona/persona.component';

const routes: Routes = [
  { path: 'personas', component: PersonasComponent },
  { path: 'persona/:id', component: PersonaComponent },
  { path: '**', pathMatch: 'full', redirectTo: 'personas' }
];



@NgModule({
  imports: [
    RouterModule.forRoot( routes )
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
