import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../../servicios/login.service';
import { LoginModelo } from '../../../modelos/login.modelo';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  login: LoginModelo = new LoginModelo();

  constructor( private loginService: LoginService ) { }

  ngOnInit(): void {
    
  }

  acceder(  ) {

    let peticion: Observable<any>;

    peticion = this.loginService.acceder(this.login);

    peticion.subscribe( resp => {

      Swal.fire({
                icon: 'info',
                title: 'OK',
                text: resp.mensaje,
              }).then( resp => {

      });
    }, e => {Swal.fire({
              icon: 'error',
              title: 'Algo salio mal',
              text: e.status +'. '+e.error.errors[0],
            })
       }
    );
  }

}
