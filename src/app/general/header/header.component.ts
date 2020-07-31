import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { TokenService } from 'src/app/servicios/token.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isLogged = false;
  @Output()
  toggleSideBarForMe: EventEmitter<any>= new EventEmitter();

  constructor(private tokenService: TokenService,private router:Router) { }

  ngOnInit() {
    if (this.tokenService.getToken()) {
          this.isLogged = true;
        } else {
          this.isLogged = false;
        }
  }

  onLogOut(): void {
    this.tokenService.logOut();
    
      this.router.navigate(["/login"]); //for the case 'the user logout I want him to be redirected to home.'

  }


  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}
