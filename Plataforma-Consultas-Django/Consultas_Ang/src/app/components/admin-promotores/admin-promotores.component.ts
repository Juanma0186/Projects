import { Component, OnInit } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { BankData } from '../../models/bankData';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { quitarAcentos } from '../../models/utils';

import { User } from '../../models/user';

@Component({
  selector: 'app-admin-promotores',
  standalone: true,
  imports: [NgFor, RouterLink, CommonModule],
  templateUrl: './admin-promotores.component.html',
})
export class AdminPromotoresComponent implements OnInit {
  datosPromotores: { promotor: string; usuarios: BankData[] }[] = [];
  currentPromotorData: BankData[] = [];
  userLoginOn: boolean = false;
  currentUserEntries: User[] = [];
  promotoresFiltrados: { promotor: string; usuarios: BankData[] }[] = [];

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    const token = localStorage.getItem('currentUser');
    if (token) {
      this.loginService.getTodosLosPromotores(token).subscribe((datos) => {
        const datosAgrupados: { [promotor: string]: BankData[] } = {};
        datos.forEach((dato) => {
          if (!datosAgrupados[dato.promotor]) {
            datosAgrupados[dato.promotor] = [];
          }
          datosAgrupados[dato.promotor].push(dato);
        });
        this.datosPromotores = [];

        for (const promotor in datosAgrupados) {
          // Ordena las aportaciones de cada promotor por fecha de más nueva a más vieja
          datosAgrupados[promotor].sort(
            (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
          );
          this.datosPromotores.push({
            promotor,
            usuarios: datosAgrupados[promotor],
          });
        }
        this.filterResults('');
      });
    }
  }


  filterResults(text: string) {
    if (!text) {
      this.promotoresFiltrados = this.datosPromotores;
    } else {
      this.promotoresFiltrados = this.datosPromotores?.filter(
        (promotor) =>
          promotor?.promotor.toLowerCase().includes(text.toLowerCase()) ||
          quitarAcentos(promotor?.promotor)
            .toLowerCase()
            .includes(quitarAcentos(text).toLowerCase())
      );
    }
  }
}
