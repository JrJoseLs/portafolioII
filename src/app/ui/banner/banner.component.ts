import { Component } from '@angular/core';
import { ThemeService } from 'src/app/services/theme.service';


@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
isActive: boolean = false;

  toggleCard(): void {
    this.isActive = !this.isActive;
  }
  /* THEME */
  constructor(private themeService: ThemeService) {}

  toggleDarkMode() {
    this.themeService.toggleDarkMode();
  }

  isDarkMode() {
    return this.themeService.isDarkMode();
  }
}
