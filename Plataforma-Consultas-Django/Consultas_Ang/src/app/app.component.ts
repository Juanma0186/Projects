import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DarkModeComponent } from './components/dark-mode/dark-mode.component';
import { LoginComponent } from './components/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    NavbarComponent,
    DarkModeComponent,
    LoginComponent,
  ],
  templateUrl: './app.component.html',
})
export class AppComponent {
  title = 'Plataforma de Digital de Consultas';
}
