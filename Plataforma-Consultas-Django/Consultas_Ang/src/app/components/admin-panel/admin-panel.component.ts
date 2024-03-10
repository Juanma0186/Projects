import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-panel.component.html',
})
export class AdminPanelComponent {
  option: string = localStorage.getItem('option') ?? 'inicio';
  onOption(option: string): void {
    this.option = option;
    //Guardamos la opción seleccionada en el localStorage
    localStorage.setItem('option', option);
  }
}
