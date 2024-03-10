import { Injectable, inject } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  private toastr = inject(ToastrService);
  private loginService = inject(LoginService);
  private router = inject(Router);
  private lastUrl: string = 'login';
  private toastMostrado: { [key: string]: boolean } = {};

  capitalize(s: string): string {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase()
  }

  canActivate = (
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree => {
    const token = localStorage.getItem('currentUser');
    if (token) {
      return this.loginService.getUserAutenticado(token).pipe(
        map(user => {
          // Aquí va tu lógica de autorización basada en los datos del usuario
          if (next.data['roles'] && next.data['roles'].indexOf(user.rol) === -1) {
            this.toastr.error('Lo siento, tu rol de ' + this.capitalize(user.rol) + ' no tiene permiso para acceder a esta página.');
            this.router.navigate([this.lastUrl]);
            return false;
          }

          // Rol de promotor
          if (user.rol === 'promotor') {
            if (next.params['nombre'] !== user.promotor) {
              this.toastr.error('Lo siento ' + this.capitalize(user.promotor ?? '') + ', esta no es tu empresa.');
              this.router.navigate([this.lastUrl]);
              return false;
            } else {
              if (!this.toastMostrado[user.rol]) {
                this.toastr.info('Bienvenid@ ' + this.capitalize(user.username) + ' / ' + this.capitalize(user.promotor ?? '') + '.');
                this.toastMostrado[user.rol] = true;  // Marca el toast como mostrado
              }
              return true;
            }
          }

          // Rol de ciudadano
          if (user.rol === 'ciudadano') {
            if (next.params['nombre'] !== user.username.toLowerCase()) {
              this.toastr.error('Lo siento, ciudadano ' + this.capitalize(user.username) + ', esta no es tu información.');
              this.router.navigate([this.lastUrl]);
              return false;
            } else {
              if (!this.toastMostrado[user.rol]) {
                this.toastr.info('Bienvenid@ ' + this.capitalize(user.username) + '.');
                this.toastMostrado[user.rol] = true;  // Marca el toast como mostrado
              }
              return true;
            }
          }

          // Rol de banco
          if (user.rol === 'banco') {
            if (next.params['banco'] !== (user.entidad ?? '').toLowerCase()) {
              this.toastr.error('Lo siento ' + this.capitalize(user.entidad ?? '') + ', este no eres tu.');
              this.router.navigate([this.lastUrl]);
              return false;
            } else {
              if (!this.toastMostrado[user.rol]) {
                this.toastr.info('Bienvenid@ ' + this.capitalize(user.username) + '/' + this.capitalize(user.entidad ?? '') + '.');
                this.toastMostrado[user.rol] = true;  // Marca el toast como mostrado
              }
              return true;
            }
          }

          // Rol de admin
          if (user.rol === 'admin') {
            if (!this.toastMostrado[user.rol]) {
              this.toastr.info('Bienvenid@ ' + this.capitalize(user.username) + '/' + this.capitalize(user.rol) + '.');
              this.toastMostrado[user.rol] = true;  // Marca el toast como mostrado
            }
            return true;
          }

          return false;  // Si el rol del usuario no coincide con ninguno de los anteriores, devuelve false
        }),
        catchError(error => {
          console.log(error);
          this.toastr.info('Por favor, inicia sesión para continuar.');
          this.router.navigate(['/login']);
          return of(false);
        })
      );
    } else {
      this.toastr.info('Por favor, inicia sesión para continuar.');
      this.router.navigate(['/login']);
      return false;
    }
  }

}
