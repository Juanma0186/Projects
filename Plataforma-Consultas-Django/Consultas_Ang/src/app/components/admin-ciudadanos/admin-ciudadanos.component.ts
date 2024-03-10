import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { quitarAcentos } from '../../models/utils';
import { Router } from '@angular/router';
@Component({
  selector: 'app-admin-ciudadanos',
  standalone: true,
  imports: [NgFor, RouterLink, NgIf, CommonModule],
  templateUrl: './admin-ciudadanos.component.html',
})
export class AdminCiudadanosComponent implements OnInit {
  ciudadanos?: User[];
  promotoresData: { [key: string]: any } = {};
  nombresCiudadanos: string[] = [];
  ciudadanosFiltrados?: User[] = [];
  aportacionesPorCiudadano: { [username: string]: any[] } = {};
  totalAportaciones: { [username: string]: number } = {};

  constructor(
    private loginService: LoginService,
    private router: Router
    ) {}

  ngOnInit() {
    const token = localStorage.getItem('currentUser');
    if (token) {
        this.loginService.getUsers(token).subscribe((usuarios) => {
            this.ciudadanos = usuarios.filter(
                (usuario) => usuario.rol === 'ciudadano'
            );
            this.ciudadanos.forEach((ciudadano) => {
                this.loginService.getDatosUsuario(ciudadano.username,token).subscribe((aportaciones) => {
                    this.aportacionesPorCiudadano[ciudadano.username] = aportaciones;
                    let suma = 0;
                    aportaciones.forEach((data) => {
                        suma += data.cantidad;
                    });
                    this.totalAportaciones[ciudadano.username] = suma;
                });
            });

            this.filterResults('');
        });
    } else {
        // El usuario no está logueado, redirige a la página de login
        this.router.navigate(['/login']);
    }
}


  filterResults(text: string) {
    if (!text) {
      this.ciudadanosFiltrados = this.ciudadanos;
    } else {
      this.ciudadanosFiltrados = this.ciudadanos?.filter(
        (ciudadano) =>
          ciudadano?.first_name.toLowerCase().includes(text.toLowerCase()) ||
          quitarAcentos(ciudadano?.last_name)
            .toLowerCase()
            .includes(quitarAcentos(text).toLowerCase())
      );
    }
  }
}
