import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { User } from '../../models/user';
import { BankData } from '../../models/bankData';
import { NgFor, NgIf } from '@angular/common';
import { Subject } from 'rxjs';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { ChatComponent } from '../chat/chat.component';
import { ReclamacionesComponent } from '../reclamaciones/reclamaciones.component';

@Component({
  selector: 'app-ciudadano',
  standalone: true,
  templateUrl: './ciudadano.component.html',
  imports: [NgFor, NgIf, CommonModule, ChatComponent, ReclamacionesComponent],
})
export class CiudadanoComponent implements OnInit, OnDestroy {
  currentBankData?: BankData[];
  totalAportaciones: number[] = [];
  ultimoMes: string = '';
  cantidad: number = 0;
  total: number = 0;
  private unsubscribe$ = new Subject<void>();
  private loginService = inject(LoginService);
  isAdmin: boolean = false;
  currentEntidadData: any;
  currentUser?: User;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    // Obtiene el nombre del usuario de la URL
    const nombreUsuario = this.route.snapshot.paramMap.get('nombre');
    const token = localStorage.getItem('currentUser');
    if (nombreUsuario) {
      if (token) {
        this.loginService.getUserAutenticado(token).subscribe((user) => {
          this.currentUser = user;
          if (user) {
            if (user.rol === 'admin') {
              this.isAdmin = true;
            }
          }
        });

        this.loginService
          .getDatosUsuario(nombreUsuario, token) // Obtiene los datos del usuario
          .subscribe((bankData) => {
            console.log(bankData);
            //ver si es admin
            this.currentBankData = bankData;
            // Guarda los datos del banco
            let suma = 0;
            bankData.forEach((data, index) => {
              suma += data.cantidad;
              this.totalAportaciones[index] = suma; // Calcula la suma acumulada de las aportaciones
              if (index === bankData.length - 1) {
                this.ultimoMes = data.mes;
                this.cantidad = data.cantidad;
                this.total = suma;
              }
            });
          });
      }
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
