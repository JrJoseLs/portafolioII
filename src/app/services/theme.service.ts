import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
private darkMode = false;

  constructor() {}

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    // Puedes agregar más lógica aquí, como guardar el estado del tema en el almacenamiento local.
  }

  isDarkMode() {
    return this.darkMode;
  }
}
