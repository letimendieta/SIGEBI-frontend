import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DefaultComponent } from './default.component';
import { PersonaComponent } from 'src/app/vistas/formularios/persona/persona.component';
import { PersonasComponent } from 'src/app/vistas/listas/personas/personas.component';
import { PacienteComponent } from 'src/app/vistas/formularios/paciente/paciente.component';
import { PacientesComponent } from 'src/app/vistas/listas/pacientes/pacientes.component';
import { FuncionarioComponent } from 'src/app/vistas/formularios/funcionario/funcionario.component';
import { FuncionariosComponent } from 'src/app/vistas/listas/funcionarios/funcionarios.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { RouterModule } from '@angular/router';
import { MatSidenavModule} from '@angular/material/sidenav';
import { MatDividerModule} from '@angular/material/divider';
import { SharedModule } from 'src/app/general/shared.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { DashboardService } from 'src/app/vistas/dashboard.service';
import {ReactiveFormsModule} from '@angular/forms'



@NgModule({
  declarations: [
    DefaultComponent,
    PersonasComponent,
    PersonaComponent,
    PacientesComponent,
    PacienteComponent,
    FuncionariosComponent,
    FuncionarioComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FlexLayoutModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    DashboardService
  ]
})
export class DefaultModule { }
