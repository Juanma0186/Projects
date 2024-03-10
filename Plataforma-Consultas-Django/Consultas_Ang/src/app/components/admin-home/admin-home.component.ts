import { Component, NgModule, OnInit, ViewChild, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { forkJoin } from 'rxjs';
import ApexCharts from 'apexcharts';

@Component({
  selector: 'app-admin-home',
  standalone: true,
  imports: [],
  templateUrl: './admin-home.component.html',
  styles: ``,
})
export class AdminHomeComponent implements OnInit {
  private loginService = inject(LoginService);

  ngOnInit(): void {
    //! obtener mes y cantidad de aportaciones de cada promotor
    const token = localStorage.getItem('currentUser');
    if (token) {
      let sumaPorPromotor: any = {};
      this.loginService.getPromotores(token).subscribe((promotores) => {
        let observables = promotores.map((promotor) =>
          this.loginService.getPromotorData(promotor.nombre, token)
        );
        forkJoin(observables).subscribe((allPromotorData) => {
          allPromotorData.forEach((promotorData, index) => {
            let promotor = promotores[index];
            if (!sumaPorPromotor[promotor.nombre]) {
              sumaPorPromotor[promotor.nombre] = {};
            }
            for (let dato of promotorData) {
              let mes = dato.mes;
              let cantidad = dato.cantidad;
              if (sumaPorPromotor[promotor.nombre][mes]) {
                sumaPorPromotor[promotor.nombre][mes] += cantidad;
              } else {
                sumaPorPromotor[promotor.nombre][mes] = cantidad;
              }
            }
          });
          // console.log('Suma por promotor:', sumaPorPromotor);
          // let aportacionesDeCochesEnEnero = sumaPorPromotor['Coches']['Enero'];
          // console.log(
          //   'Aportaciones de coches en enero:',
          //   aportacionesDeCochesEnEnero
          // );

          const optionsAportacionesPromotor = {
            series: [
              {
                name: 'Juguetes',
                data: [
                  sumaPorPromotor['Juguetes']['Enero'],
                  sumaPorPromotor['Juguetes']['Febrero'],
                  sumaPorPromotor['Juguetes']['Marzo'],
                  sumaPorPromotor['Juguetes']['Abril'] ?? 0,
                ],
              },
              {
                name: 'Coches',
                data: [
                  sumaPorPromotor['Coches']['Enero'],
                  sumaPorPromotor['Coches']['Febrero'],
                  sumaPorPromotor['Coches']['Marzo'],
                  sumaPorPromotor['Coches']['Abril'] ?? 0,
                ],
              },
              {
                name: 'Palomitas',
                data: [
                  sumaPorPromotor['Palomitas']['Enero'],
                  sumaPorPromotor['Palomitas']['Febrero'],
                  sumaPorPromotor['Palomitas']['Marzo'],
                  sumaPorPromotor['Palomitas']['Abril'] ?? 0,
                ],
              },
            ],
            chart: {
              height: 350,
              width: 600,
              type: 'area',
              zoom: {
                enabled: false,
              },
            },
            dataLabels: {
              enabled: true,
            },
            stroke: {
              curve: 'smooth',
            },
            xaxis: {
              type: 'month',
              categories: ['Enero', 'Febrero', 'Marzo', 'Abril'],
            },
            grid: {
              row: {
                colors: ['#f3f3f3', 'transparent'],
                opacity: 0.5,
              },
            },
          };

          const chartAportacionesPromotor = new ApexCharts(
            document.querySelector('#chartAportacionesPromotor'),
            optionsAportacionesPromotor
          );
          chartAportacionesPromotor.render();
        });
      });

      //! obtener cantidad de usuarios por banco
      let usuariosPorBanco: any = {};
      this.loginService.getUsers(token).subscribe((usuarios) => {
        usuarios.forEach((usuario) => {
          if (usuario.rol === 'ciudadano' || usuario.rol === 'banco') {
            let banco = usuario.entidad;
            if (banco !== undefined) {
              if (usuariosPorBanco[banco]) {
                usuariosPorBanco[banco]++;
              } else {
                usuariosPorBanco[banco] = 1;
              }
            }
          }
        });
        // console.log('Usuarios por banco:', usuariosPorBanco);
        // console.log('Usuarios caixa:', usuariosPorBanco['Caixa']);
        // console.log('Usuarios bankia:', usuariosPorBanco['Bankia']);

        const optionsPersonasBanco = {
          series: [usuariosPorBanco['Bankia'], usuariosPorBanco['Caixa']],
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Bankia', 'Caixa'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };

        const chartPersonasBanco = new ApexCharts(
          document.querySelector('#chartPersonasBanco'),
          optionsPersonasBanco
        );
        chartPersonasBanco.render();
      });

      //! obtener cantidad de usuarios por promotor
      let usuariosPorpromotor: any = {};
      this.loginService.getUsers(token).subscribe((usuarios) => {
        usuarios.forEach((usuario) => {
          if (usuario.rol === 'ciudadano') {
            let promotor = usuario.promotor;
            if (promotor !== undefined) {
              if (usuariosPorpromotor[promotor]) {
                usuariosPorpromotor[promotor]++;
              } else {
                usuariosPorpromotor[promotor] = 1;
              }
            }
          }
        });
        // console.log('Usuarios por promotor:', usuariosPorpromotor);
        // console.log('Usuarios juguetes:', usuariosPorpromotor['Juguetes']);
        // console.log('Usuarios coches:', usuariosPorpromotor['Coches']);
        // console.log('Usuarios Palomitas:', usuariosPorpromotor['Palomitas']);

        const optionsPersonasPromotor = {
          series: [
            usuariosPorpromotor['Juguetes'],
            usuariosPorpromotor['Coches'],
            usuariosPorpromotor['Palomitas'],
          ],
          chart: {
            width: 380,
            type: 'pie',
          },
          labels: ['Juguetes', 'Coches', 'Palomitas'],
          responsive: [
            {
              breakpoint: 480,
              options: {
                chart: {
                  width: 200,
                },
                legend: {
                  position: 'bottom',
                },
              },
            },
          ],
        };

        const chartPersonasPromotor = new ApexCharts(
          document.querySelector('#chartPersonasPromotor'),
          optionsPersonasPromotor
        );
        chartPersonasPromotor.render();
      });

      //! obtener cantidad de aportaciones por banco
      let aportacionesPorBanco: any = {};
      this.loginService.getEntidades(token).subscribe((entidades) => {
        let observables = entidades.map((entidad) =>
          this.loginService.getDatosEntidadPorNombre(entidad.nombre, token)
        );
        forkJoin(observables).subscribe((allData) => {
          allData.forEach((datos) => {
            for (let dato of datos) {
              let banco = dato.entidad;
              let cantidad = dato.cantidad;
              if (aportacionesPorBanco[banco]) {
                aportacionesPorBanco[banco] += cantidad;
              } else {
                aportacionesPorBanco[banco] = cantidad;
              }
            }
          });
          // console.log('aportacionesPorBanco:', aportacionesPorBanco);
          // console.log(
          //   'aportacionesPorBanco de caixa:',
          //   aportacionesPorBanco['Caixa']
          // );
          // console.log(
          //   'aportacionesPorBanco de bankia :',
          //   aportacionesPorBanco['Bankia']
          // );

          const optionsAportacionesBanco = {
            series: [
              aportacionesPorBanco['Bankia'],
              aportacionesPorBanco['Caixa'],
            ],
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['Bankia', 'Caixa'],
            responsive: [
              {
                breakpoint: 480,
                options: {
                  chart: {
                    width: 200,
                  },
                  legend: {
                    position: 'bottom',
                  },
                },
              },
            ],
          };

          const chartAportacionesBanco = new ApexCharts(
            document.querySelector('#chartDineroBanco'),
            optionsAportacionesBanco
          );
          chartAportacionesBanco.render();
        });

        console.log('aportacionesPorBanco:', aportacionesPorBanco['Bankia']);
      });
    }
  }
}
