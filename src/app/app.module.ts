import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { PersonaComponent } from './vistas/formularios/persona/persona.component';
import { PersonasComponent } from './vistas/listas/personas/personas.component';
import { HeaderComponent } from './vistas/general/header/header.component';
import { FooterComponent } from './vistas/general/footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    PersonaComponent,
    PersonasComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
