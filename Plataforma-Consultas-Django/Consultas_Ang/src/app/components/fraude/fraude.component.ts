import { Component, inject } from '@angular/core';
import { LoginService } from '../../services/login.service';
import { HttpClient } from '@angular/common/http';
import { BankData } from '../../models/bankData';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fraude',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './fraude.component.html',
})
export class FraudeComponent {
  fraudes: { usuario: string; mensaje: string }[] = [];
  private loginService = inject(LoginService);
  private http = inject(HttpClient);
  private route = inject(ActivatedRoute);
  private toastr = inject(ToastrService);
  isAdmin: boolean = false;

  // En tu archivo TypeScript
  detectarFraude() {
    // Obtener el token del usuario logueado
    const token = localStorage.getItem('currentUser');
    const botonFraude = document.getElementById('botonFraude');

    // Obtener el nombre de la entidad del usuario logueado
    if (token) {
      this.loginService.getUserAutenticado(token).subscribe((user) => {
        if (user.rol === 'admin') {
          console.log('rol', user.rol);

          this.isAdmin = true;
        }

        const entidad = this.route.snapshot.paramMap.get('banco');

        // Leer el archivo JSON correspondiente de la carpeta 'assets/fraude'
        this.http
          .get<BankData[]>(`assets/fraude/${entidad?.toLowerCase()}.json`)
          .subscribe((datosOficiales: BankData[]) => {
            // Hacer una solicitud a la API para obtener los datos de la entidad
            this.http
              .get<BankData[]>(
                `http://localhost:8000/api/aportaciones/?entidad=${entidad}`,
                {
                  headers: { Authorization: `Token ${token}` },
                }
              )
              .subscribe((datosApi: BankData[]) => {
                // Comparar los dos conjuntos de datos para detectar posibles fraudes
                datosApi.forEach((datoApi) => {
                  const datoOficial = datosOficiales.find(
                    (d) =>
                      d.usuario === datoApi.usuario && d.mes === datoApi.mes
                  );
                  if (!datoOficial) {
                    this.fraudes.push({
                      usuario: datoApi.usuario,
                      mensaje: `Falta la aportación de ${datoApi.usuario} en el mes de ${datoApi.mes} en los datos oficiales`,
                    });
                  } else if (datoApi.cantidad !== datoOficial.cantidad) {
                    this.fraudes.push({
                      usuario: datoApi.usuario,
                      mensaje: `La cantidad de la aportación de ${datoApi.usuario} en el mes de ${datoApi.mes} es diferente en los datos oficiales y en los datos del banco`,
                    });
                  }
                });

                if (this.fraudes.length === 0) {
                  this.toastr.success('No se detectaron fraudes');
                } else {
                  this.toastr.warning(
                    `Se detectaron ${this.fraudes.length} fraudes`
                  );
                  this.fraudes.sort((a, b) =>
                    a.usuario.localeCompare(b.usuario)
                  );
                }
              });
          });
      });
    }

    botonFraude?.classList.add('animate-fade-left', 'animate-reverse');
    setTimeout(() => {
      botonFraude?.classList.remove('animate-fade-left', 'animate-reverse');
      botonFraude?.classList.add('hidden');
    }, 1000);
  }
}
