import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/servicios/auth.service';
import { Router } from '@angular/router';
import { UsuarioModelo } from 'src/app/modelos/usuario.modelo';
import { TokenService } from 'src/app/servicios/token.service';
import { ToastrService } from 'ngx-toastr';
import { FormGroup, FormControl, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  

  forma: FormGroup;
  isLogged = false;
    isLoginFail = false;
    loginUsuario: UsuarioModelo;
    nombreUsuario: string;
    password: string;
    roles: string[] = [];
    errMsj: string;

    constructor(private frmbuilder: FormBuilder,
      private tokenService: TokenService,
      private authService: AuthService,
      private router: Router,
      private toastr: ToastrService
    ) { }

    ngOnInit() {
      this.forma = this.frmbuilder.group({
        nombreUsuario: [''],
        password: ['']

    })
      if (this.tokenService.getToken()) {
        this.isLogged = true;
        this.isLoginFail = false;
        this.roles = this.tokenService.getAuthorities();
      }
    }

    onLogin(): void {
      console.log(" prueba")
      console.log(this.forma.get('nombreUsuario').value)
      this.loginUsuario = new UsuarioModelo(this.forma.get('nombreUsuario').value, this.forma.get('password').value);
      this.authService.login(this.loginUsuario).subscribe(
        data => {
          
          this.isLogged = true;

          this.tokenService.setToken(data.token);
          this.tokenService.setUserName(data.nombreUsuario);
          this.tokenService.setAuthorities(data.authorities);
          this.roles = data.authorities;
          this.toastr.success('Bienvenido ' + data.nombreUsuario, 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/']);
        },
        err => {
          this.isLogged = false;
          this.errMsj = err.error.message;
          this.toastr.error(this.errMsj, 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
           console.log(err.error.message);
        }
      );
    }



}