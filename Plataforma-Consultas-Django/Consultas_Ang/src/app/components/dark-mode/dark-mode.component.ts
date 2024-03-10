import { Component } from '@angular/core';

@Component({
  selector: 'app-dark-mode',
  standalone: true,
  imports: [],
  templateUrl: './dark-mode.component.html',
  styles: ``,
})
export class DarkModeComponent {
  isDarkMode = JSON.parse(window.localStorage.getItem('darkMode') || 'false');

  toggleTheme(): void {
    this.isDarkMode = !this.isDarkMode;
    document.documentElement.classList.toggle('dark', this.isDarkMode);
    localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
    // localStorage.setItem('darkMode', JSON.stringify(this.isDarkMode));
  }

  ngOnInit() {
    if (this.isDarkMode) {
      document.documentElement.classList.add('dark');
    }
  }
}
