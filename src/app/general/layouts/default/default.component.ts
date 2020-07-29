import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  isLogged = false;
  nombreUsuario = '';

sideBarOpen = true;
  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    if (this.tokenService.getToken()) {
      this.isLogged = true;
      this.nombreUsuario = this.tokenService.getUserName();
    } else {
      this.isLogged = false;
      this.nombreUsuario = '';
    }
  }


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }


}
