import { Component, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { CitySearchComponent } from './city-search/city-search.component';
import { MatCardModule } from '@angular/material/card';
import { WeatherDisplayComponent } from './weather-display/weather-display.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

const darkClassName = 'dark-theme';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatToolbarModule,
    MatCardModule,
    CitySearchComponent,
    WeatherDisplayComponent,
    MatSlideToggleModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'weather-app';
  readonly toggleState = signal(localStorage.getItem(darkClassName) === 'true');

  constructor() {
    effect(() => {
      localStorage.setItem(darkClassName, this.toggleState().toString());
      document.documentElement.classList.toggle(
        darkClassName,
        this.toggleState()
      );
    });
  }
}
