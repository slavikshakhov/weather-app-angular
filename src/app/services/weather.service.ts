import { Injectable, signal } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  first,
  firstValueFrom,
  map,
  switchMap,
} from 'rxjs';
import { ICurrentWeather } from '../interfaces/icurrent-weather';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { PostalCodeService, defaultPostalCode } from './postal-code.service';

export interface ICurrentWeatherData {
  // exported to support unit testing
  weather: [
    {
      description: string;
      icon: string;
    }
  ];
  main: {
    temp: number;
  };
  sys: {
    country: string;
  };
  dt: number;
  name: string;
}
export interface IWeatherService {
  getCurrentWeather(
    city: string,
    country?: string
  ): Observable<ICurrentWeather>;
  getCurrentWeatherByCoords(
    coords: GeolocationCoordinates
  ): Observable<ICurrentWeather>;

  updateCurrentWeatherSignal(searchText: string, country?: string): void;
}
export const defaultWeather: ICurrentWeather = {
  city: '--',
  country: '--',
  date: Date.now(),
  image: '',
  temperature: 0,
  description: '',
};

@Injectable({
  providedIn: 'root',
})
export class WeatherService implements IWeatherService {
  readonly currentWeatherSignal = signal(defaultWeather);
  constructor(
    private http: HttpClient,
    private postalCodeService: PostalCodeService
  ) {}
  
  async updateCurrentWeatherSignal(
    searchText: string,
    country?: string
  ): Promise<void> {
    this.currentWeatherSignal.set(
      await this.getCurrentWeatherAsPromise(searchText, country)
    );
  }
  getCurrentWeatherAsPromise(
    searchText: string,
    country?: string
  ): Promise<ICurrentWeather> {
    return firstValueFrom(this.getCurrentWeather(searchText, country));
  }

  getCurrentWeather(
    city: string,
    countryCode?: string
  ): Observable<ICurrentWeather> {
    console.log({ city, countryCode });
    return this.postalCodeService.resolvePostalCode(city).pipe(
      switchMap((postalCode) => {
        console.log({ postalCode });
        if (postalCode && postalCode !== defaultPostalCode) {
          return this.getCurrentWeatherByCoords({
            latitude: postalCode.lat,
            longitude: postalCode.lng,
          } as GeolocationCoordinates);
        } else {
          const uriParams = new HttpParams().set(
            'q',
            countryCode ? `${city},${countryCode}` : city
          );
          return this.getCurrentWeatherHelper(uriParams);
        }
      })
    );
  }
  getCurrentWeatherByCoords(
    coords: GeolocationCoordinates
  ): Observable<ICurrentWeather> {
    const uriParams = new HttpParams()
      .set('lat', coords.latitude.toString())
      .set('lon', coords.longitude.toString());
    console.log({ uriParams });
    return this.getCurrentWeatherHelper(uriParams);
  }
  private getCurrentWeatherHelper(
    uriParams: HttpParams
  ): Observable<ICurrentWeather> {
    uriParams = uriParams.set('appid', environment.appId);
    return this.http
      .get<ICurrentWeatherData>(
        `${environment.baseUrl}api.openweathermap.org/data/2.5/weather`,
        { params: uriParams }
      )
      .pipe(map((data) => this.transformToICurrentWeather(data)));
  }

  private transformToICurrentWeather(
    data: ICurrentWeatherData
  ): ICurrentWeather {
    return {
      city: data.name,
      country: data.sys.country,
      date: data.dt * 1000,
      image: `http://openweathermap.org/img/w/${data.weather[0].icon}.png`,
      temperature: this.convertKelvinToFahrenheit(data.main.temp),
      description: data.weather[0].description,
    };
  }

  private convertKelvinToFahrenheit(kelvin: number): number {
    return (kelvin * 9) / 5 - 459.67;
  }
}
