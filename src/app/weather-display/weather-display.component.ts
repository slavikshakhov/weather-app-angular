import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { Observable } from 'rxjs';
import { ICurrentWeather } from '../interfaces/icurrent-weather';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { FahrenheitToCelciusPipe } from '../fahrenheit-to-celcius.pipe';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [
    AsyncPipe,
    DecimalPipe,
    DatePipe,
    MatSlideToggleModule,
    FormsModule,
    FahrenheitToCelciusPipe
  ],
  templateUrl: './weather-display.component.html',
  styleUrl: './weather-display.component.scss',
})
export class WeatherDisplayComponent {
  currentWeather$: Observable<ICurrentWeather>;
  isFahrenheit: boolean = true;

  constructor(private weatherService: WeatherService) {
    this.currentWeather$ = this.weatherService.currentWeather$;
  }
  get degreesCagegory() {
    return this.isFahrenheit
      ? { description: 'Fahrenheit', abbr: 'F' }
      : { description: 'Celcius', abbr: 'C' };
  }
  getOrdinal(date: number) {
    const n = new Date(date).getDate();
    return n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '';
  }
}
