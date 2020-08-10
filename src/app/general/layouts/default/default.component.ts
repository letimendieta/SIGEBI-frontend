import { Component, OnInit } from '@angular/core';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.css']
})
export class DefaultComponent implements OnInit {
  isLogged = false;
  

sideBarOpen = true;
  constructor(private tokenService: TokenService) { }

  ngOnInit(): void {
    
  }


  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }


}
