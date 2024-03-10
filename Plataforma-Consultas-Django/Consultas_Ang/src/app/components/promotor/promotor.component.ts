import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user';
import { Subject, of } from 'rxjs';
import { BankData } from '../../models/bankData';
import { NgFor, NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';

@Component({
  selector: 'app-promotor',
  standalone: true,
  templateUrl: './promotor.component.html',
  imports: [NgFor, NgIf, CommonModule, ChatComponent],
})
export class PromotorComponent implements OnInit, OnDestroy {
  currentUserEntries?: User[];
  private unsubscribe$ = new Subject<void>();
  currentPromotorData?: BankData[];
  userLoginOn: boolean = false;
  isAdmin: boolean = false;
  totalAportado: number = 0;
  ultimaAportacion?: BankData;
  maxAportacion: number = 0;
  nombrePromotor: string | undefined =
    this.route.snapshot.paramMap.get('nombre') ?? undefined;

  listaUsuariosUnicos?: User[];

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private location: Location
  ) {}

  ngOnInit() {
    // Obtiene el token del usuario del localStorage
    const token = localStorage.getItem('currentUser');
    if (token) {
      this.loginService.getUserAutenticado(token).subscribe((user) => {
        if (user) {
          if (user.rol === 'admin') {
            this.isAdmin = true;
          }
          this.currentUserEntries = [user];

          // Obtiene el nombre del promotor de la URL
          const nombrePromotor = this.route.snapshot.paramMap.get('nombre');

          this.loginService
            .getPromotorData(nombrePromotor!, token) // Incluye el token en la solicitud
            .subscribe((promotorData) => {
              this.currentPromotorData = promotorData;

              let totalAportado = 0;
              this.currentPromotorData.forEach((bankData) => {
                totalAportado += bankData.cantidad;
                if (bankData.cantidad > this.maxAportacion) {
                  this.maxAportacion = bankData.cantidad;
                }
              });

              this.totalAportado = totalAportado;

              // Guarda la última aportación hecha por el promotor
              this.ultimaAportacion =
                this.currentPromotorData[this.currentPromotorData.length - 1];
            });

          // Lista de usuarios con el promotor seleccionado sin incluir al usuario actual
          this.loginService
            .getUsersByPromotor(this.nombrePromotor ?? '', token) // Incluye el token en la solicitud
            .subscribe((data: User[]) => {
              this.listaUsuariosUnicos = data.filter(
                (user) =>
                  user.username !== this.currentUserEntries?.[0].username &&
                  user.rol !== 'promotor'
              );
            });
        }
      });
    } else {
      // El usuario no está logueado, redirige a la página de login
      this.router.navigate(['/login']);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
  goBack() {
    this.location.back();
  }
}
