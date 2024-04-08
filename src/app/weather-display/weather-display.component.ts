import { Component } from '@angular/core';
import { WeatherService } from '../services/weather.service';
import { Observable } from 'rxjs';
import { ICurrentWeather } from '../interfaces/icurrent-weather';
import { AsyncPipe, DatePipe, DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-weather-display',
  standalone: true,
  imports: [AsyncPipe, DecimalPipe, DatePipe],
  templateUrl: './weather-display.component.html',
  styleUrl: './weather-display.component.scss',
})
export class WeatherDisplayComponent {
  currentWeather$: Observable<ICurrentWeather>;

  constructor(private weatherService: WeatherService) {
    this.currentWeather$ = this.weatherService.currentWeather$;
  }
  getOrdinal(date: number) {
    const n = new Date(date).getDate();
    return n > 0
      ? ['th', 'st', 'nd', 'rd'][(n > 3 && n < 21) || n % 10 > 3 ? 0 : n % 10]
      : '';
  }
}
