import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private currentTheme: 'light-theme' | 'dark-theme' = 'light-theme';

  constructor() {
    const saved = localStorage.getItem('theme') as 'light-theme' | 'dark-theme';
    this.currentTheme = saved || 'light-theme';
    document.body.classList.add(this.currentTheme);
  }

  toggleTheme(): void {
    const isDark = this.currentTheme === 'dark-theme';
    document.body.classList.remove(this.currentTheme);
    this.currentTheme = isDark ? 'light-theme' : 'dark-theme';
    document.body.classList.add(this.currentTheme);
    localStorage.setItem('theme', this.currentTheme);
  }

  isDarkTheme(): boolean {
    return this.currentTheme === 'dark-theme';
  }
}
