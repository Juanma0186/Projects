import { Component, OnInit, inject } from '@angular/core';
import { BankDataService } from '../../services/bank-data.service';
import { BankData } from '../../models/bankData';
import { CommonModule, NgFor } from '@angular/common';
import { RouterLink } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { quitarAcentos } from '../../models/utils';

@Component({
  selector: 'app-admin-bancos',
  standalone: true,
  imports: [NgFor, CommonModule, RouterLink],
  templateUrl: './admin-bancos.component.html',
})
export class AdminBancosComponent implements OnInit {
  datosBancos: {
    banco: string;
    usuarios: {
      usuario: string;
      last_name: string;
      aportaciones: BankData[];
    }[];
  }[] = [];
  userLoginOn: boolean = false;
  last_name: string = '';
  bancosFiltrados: {
    banco: string;
    usuarios: {
      usuario: string;
      last_name: string;
      aportaciones: BankData[];
    }[];
  }[] = [];
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    // Obtiene el token del usuario del localStorage
    const token = localStorage.getItem('currentUser');
    if (token) {
      this.loginService.getTodosLosPromotores(token).subscribe((datos) => {
        const datosAgrupados: {
          [banco: string]: { [usuario: string]: BankData[] };
        } = {};
        datos.forEach((dato) => {
          this.last_name = dato.last_name;
          if (!datosAgrupados[dato.entidad]) {
            datosAgrupados[dato.entidad] = {};
          }
          if (!datosAgrupados[dato.entidad][dato.usuario]) {
            datosAgrupados[dato.entidad][dato.usuario] = [];
          }
          datosAgrupados[dato.entidad][dato.usuario].push(dato);
        });

        this.datosBancos = [];
        for (const banco in datosAgrupados) {
          const usuarios = [];
          for (const usuario in datosAgrupados[banco]) {
            usuarios.push({
              usuario: usuario,
              last_name: datosAgrupados[banco][usuario][0].last_name,
              aportaciones: datosAgrupados[banco][usuario],
            });
          }
          this.datosBancos.push({ banco, usuarios });
        }
        this.filterResults('');
      });
    }
  }

  filterResults(text: string) {
    if (!text) {
      this.bancosFiltrados = this.datosBancos;
    } else {
      this.bancosFiltrados = this.datosBancos?.filter(
        (banco) =>
          banco?.banco.toLowerCase().includes(text.toLowerCase()) ||
          quitarAcentos(banco?.banco)
            .toLowerCase()
            .includes(quitarAcentos(text).toLowerCase())
      );
    }
    console.log(this.bancosFiltrados);
  }
}
