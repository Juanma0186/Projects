import { Component, ElementRef, OnDestroy, OnInit, ViewChild, } from '@angular/core';
import { BankDataService } from '../../services/bank-data.service';
import { NgFor, NgIf } from '@angular/common';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { User } from '../../models/user';
import { Subject, of } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { BankData } from '../../models/bankData';
import { LoginService } from '../../services/login.service';
import { CommonModule } from '@angular/common';
import { Location } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ChatComponent } from '../chat/chat.component';
import { ToastrService } from 'ngx-toastr';
import { FraudeComponent } from '../fraude/fraude.component';


@Component({
  selector: 'app-banco',
  standalone: true,
  templateUrl: './banco.component.html',
  imports: [NgFor, RouterLink, NgIf, CommonModule, ChatComponent, FraudeComponent],
})
export class BancoComponent implements OnInit, OnDestroy {
  bancoData?: BankData[];
  banco?: string;
  userLoginOn: boolean = false;
  userData?: User;
  totalAportacionesPorUsuario: { [key: string]: { [key: string]: number } } =
    {};
  isAdmin: boolean = false;
  totalUsuarios: number = 0;
  totalPromotores: number = 0;
  listaUsuarios: User[] = [];
  cantidadUsuarios: number = 0;
  cantidaPromotores: string[] = [];

  private unsubscribe$ = new Subject<void>();

  constructor(
    private bankDataService: BankDataService,
    private loginService: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private http: HttpClient,
    private toastr: ToastrService
  ) { }

  //! switchMap se utiliza para cambiar a un nuevo observable cada vez que cambia el parámetro de ruta
  ngOnInit(): void {
    // Obtiene el token del usuario del localStorage
    const token = localStorage.getItem('currentUser');
    if (token) {
      this.loginService.getUserAutenticado(token).subscribe(user => {
        if (user) {
          if (user.rol === 'admin') {
            this.isAdmin = true;
          }
          this.userData = user;
  
          this.route.paramMap
            .pipe(
              switchMap((params) => {
                this.banco = params.get('banco')!;
                return this.bankDataService.getBancoData(this.banco, token);  // Incluye el token en la solicitud
              }),
              takeUntil(this.unsubscribe$)
            )
            .subscribe((data) => {
              // Ordena los datos por nombre de usuario
              data.sort((a: BankData, b: BankData) =>
                a.usuario.localeCompare(b.usuario)
              );
              data.forEach((d: BankData) => {
                this.calculateAportaciones(data);
              });
  
              this.bancoData = data;
            });
  
          // Lista de usuarios
          this.loginService.getUsers(token).subscribe((data: User[]) => {
            // Filtra los usuarios que la entidad sea igual al this.banco y que promotor no es vacio
            this.listaUsuarios = data.filter(
              (user) =>
                user.entidad?.toLowerCase() === this.banco && user.promotor !== null
            );
  
            // Contar cuantos usuarios hay
            this.cantidadUsuarios = this.listaUsuarios.length;
  
            // Contar cuantos promotores diferentes hay
            this.listaUsuarios.forEach((user) => {
              if (!this.cantidaPromotores.includes(user.promotor!)) {
                this.cantidaPromotores.push(user.promotor!);
              }
            });
          });
        }
      });
    } else {
      // El usuario no está logueado, redirige a la página de login
      this.router.navigate(['/login']);
    }
  }
  
  //? función para subir un archivo con los datos del banco
  selectedFile?: File;
  isLoading = false;
  @ViewChild('fileInput') fileInput!: ElementRef;
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  onUpload(event: Event) {
  event.preventDefault();
  if (this.selectedFile) {
    this.isLoading = true;
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target) {
        try {
          const newData = JSON.parse(e.target.result as string);
          console.log('Datos parseados', newData);

          const token = localStorage.getItem('currentUser');
          if (token) {
            const headers = new HttpHeaders().set('Authorization', `Token ${token}`);
            this.http
              .post('http://127.0.0.1:8000/api/aportaciones/', newData, { headers })
              .subscribe({
                next: (response: any) => {
                  console.log('Datos enviados al servidor', response);
                  this.isLoading = false;
                  this.toastr.success('Datos añadidos con éxito!');
                  // Aquí es donde haces la nueva solicitud GET para obtener los datos actualizados
                  if (this.banco) {
                    this.bankDataService.getBancoData(this.banco, token).subscribe((updatedData: BankData[]) => {
                      // Actualiza tus datos con los datos actualizados
                      updatedData.sort((a: BankData, b: BankData) =>
                        a.usuario.localeCompare(b.usuario)
                      );
                      updatedData.forEach((d: BankData) => {
                        this.calculateAportaciones(updatedData);
                      });

                      this.bancoData = updatedData;
                    });
                  }
                },
                error: (error: any) => {
                  console.error('Error al enviar los datos', error);
                  this.isLoading = false;
                  this.toastr.error('Error al añadir los datos.');
                },
              });
          }
        } catch (error) {
          console.error('No se pudo parsear el archivo como JSON', error);
          this.isLoading = false;
        }
      }
    };
    reader.readAsText(this.selectedFile);
    // Limpiar el archivo seleccionado para que no se suba de nuevo
    this.selectedFile = undefined;
    // Limpiar el input del archivo
    this.fileInput.nativeElement.value = '';
  }
}



  ngOnDestroy(): void {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }

  //? función para regresar a la página anterior
  goBack() {
    this.location.back();
  }

  //? función para calcular las aportaciones acumuladas por usuario
  calculateAportaciones(data: BankData[]) {
    // Ordena los datos por nombre de usuario
    data.sort((a: BankData, b: BankData) => a.usuario.localeCompare(b.usuario));

    let sumasAcumuladas: { [key: string]: number } = {};
    let usuarioActual = '';
    data.forEach((d: BankData) => {
      const usuario = d.usuario;
      if (usuario !== usuarioActual) {
        usuarioActual = usuario;
        sumasAcumuladas[usuario] = 0;
      }
      sumasAcumuladas[usuario] += d.cantidad;
      if (!this.totalAportacionesPorUsuario[usuario]) {
        this.totalAportacionesPorUsuario[usuario] = {};
      }
      this.totalAportacionesPorUsuario[usuario][d.mes] =
        sumasAcumuladas[usuario];
    });

    this.bancoData = data;
  }
}
