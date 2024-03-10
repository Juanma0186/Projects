import { CommonModule } from '@angular/common';
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule,Validators,} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Location } from '@angular/common';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-reclamaciones',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reclamaciones.component.html',
})
export class ReclamacionesComponent {
  motivos = [
    'Acceso a los datos',
    'Rectificación de los datos',
    'Supresión de los datos ("derecho al olvido")',
    'Oposición al procesamiento',
    'Limitación del procesamiento',
    'Portabilidad de los datos',
    'Decisión automatizada y perfilado',
    'Otro motivo'
  ];

  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private location: Location,
    private toastr: ToastrService
    ){}

  reclamacionForm = this.formBuilder.group({
    nombre: ['', [Validators.required]],
    apellido: ['', [Validators.required]],
    correo: ['', [Validators.required, Validators.email]],
    telefono: ['', [Validators.required, Validators.minLength(9)]],
    motivo: ['', Validators.required],
    descripcion: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(20)]],
  });

  get nombre() { return this.reclamacionForm.get('nombre'); }
  get apellido() { return this.reclamacionForm.get('apellido'); }
  get correo() { return this.reclamacionForm.get('correo'); }
  get telefono() { return this.reclamacionForm.get('telefono'); }
  get motivo() { return this.reclamacionForm.get('motivo'); }
  get descripcion() { return this.reclamacionForm.get('descripcion'); } 

  onSubmit() {
    this.http
      .post('http://localhost:3000/reclamaciones', this.reclamacionForm.value)
      .subscribe({
        next: (response) => {
          this.reclamacionForm.reset(); 
          this.toastr.success('Reclamación enviada con éxito') ; 
          
         
        },
        error: (error) => {
         this.toastr.error('Error al enviar la reclamación');
        },
      });
  }
}
