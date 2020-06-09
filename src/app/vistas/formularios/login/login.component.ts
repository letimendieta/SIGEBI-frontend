import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';

import { UsuarioModelo } from 'src/app/modelos/usuario.modelo';
import { LoginService } from 'src/app/servicios/login.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  usuario: UsuarioModelo = new UsuarioModelo();
  recordarme = false;

  constructor( private auth: LoginService,
               private router: Router ) { }

  ngOnInit() {

    if ( localStorage.getItem('usuario') ) {
      this.usuario.usuario = localStorage.getItem('usuario');
      this.recordarme = true;
    }

  }


  login( form: NgForm ) {

    if (  form.invalid ) { return; }

    Swal.fire({
      allowOutsideClick: false,
      icon: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();


    this.auth.login( this.usuario )
      .subscribe( resp => {

        console.log(resp);
        Swal.close();

        if ( this.recordarme ) {
          localStorage.setItem('usuario', this.usuario.usuario);
        }


        this.router.navigateByUrl('/');

      }, (err) => {

        console.log(err.error.error.message);
        Swal.fire({
          title: 'Error al autenticar',
          text: err.error.error.message,
          icon: 'error'
        });
      });

  }

}
