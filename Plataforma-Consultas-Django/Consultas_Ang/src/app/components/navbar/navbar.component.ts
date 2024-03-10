import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  title = 'Plataforma Digital de Consultas';
  isLoggedIn: boolean = false;

  constructor(private loginService: LoginService, private router: Router) {
    this.isLoggedIn = this.isUserLoggedIn();
    this.loginService.getCurrentUserLoginOn().subscribe(isLoggedIn => {
      this.isLoggedIn = isLoggedIn;
    });
  }

  isUserLoggedIn(): boolean {
    return !!localStorage.getItem('currentUser');
  }

  logout() {
    this.loginService.logout();
    this.router.navigate(['/login']);
  }
}
