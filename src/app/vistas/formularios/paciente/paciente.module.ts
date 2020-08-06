import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PersonasComponent } from 'src/app/vistas/listas/personas/personas.component';

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
    PersonasComponent,    
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MatSidenavModule,
    MatDividerModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule
  ],
  providers: [
    DashboardService
  ]
})
export class DefaultModule { }
