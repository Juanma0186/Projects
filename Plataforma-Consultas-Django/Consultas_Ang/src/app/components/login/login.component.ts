import { NgClass, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login.service';
import { LoginRequest, LoginRequest2 } from '../../models/loginRequest';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, NgClass, NgIf],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  loginError: string = '';

  constructor() {}

  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private loginService = inject(LoginService);

  loginForm = this.formBuilder.group({
    username: ['', [Validators.required, Validators.minLength(3)]],
    password: ['', [Validators.required, Validators.minLength(4)]],
  });

  get nombre() {
    return () => this.loginForm.controls.username;
  }

  get contrasena() {
    return () => this.loginForm.controls.username;
  }

  login() {
    if (this.loginForm.valid) {
        this.loginService.login2(this.loginForm.value as LoginRequest2).subscribe({
            next: (token) => {
              console.log('token ->' + token);
              
                this.loginService.getUserAutenticado(token).subscribe({
                    next: (userData) => {
                      console.log('userData ->' + userData);
                      
                      console.log(userData);
                      
                        const rol = userData.rol;
                        const nombre = userData.username.toLowerCase();
                        
                        if (rol === 'ciudadano') {
                            this.router.navigate([`ciudadano/${nombre}`]);
                        } else if (rol === 'admin') {
                            this.router.navigate(['admin/inicio']);
                        } else if (rol === 'promotor') {
                            this.router.navigate(['promotor', userData.promotor]);
                        } else if (rol === 'banco') {
                            this.router.navigate(['entidad', userData.entidad?.toLowerCase()]);
                        }
                    },
                    error: (error) => {
                        console.log(error);
                        this.loginError = error;
                    },
                });
            },
            error: (error) => {
                console.log(error);
                this.loginError = error;
            },
        });
    } else {
        this.loginForm.markAllAsTouched();
    }
}

}
