import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  FormControl,
  FormsModule,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { debounceTime, filter, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { WeatherService } from '../services/weather.service';
import { ObjectToKeysPipe } from '../object-to-keys.pipe';
import { JsonPipe } from '@angular/common';

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    ReactiveFormsModule,
    FormsModule,
    ObjectToKeysPipe,
    JsonPipe,
  ],
  templateUrl: './city-search.component.html',
  styleUrl: './city-search.component.scss',
})
export class CitySearchComponent {
  search = new FormControl('', [Validators.required, Validators.minLength(2)]);
  errors: ValidationErrors | null = null;
  constructor(private weatherService: WeatherService) {
    this.search.valueChanges
      .pipe(
        tap(() => {
          console.log({ result: this.search });
          this.errors = this.search.errors;
            
        }),
        filter(() => this.search.valid),
        debounceTime(1000),
        tap((searchValue) => this.doSearch(searchValue)),
        takeUntilDestroyed()
      )
      .subscribe();
  }
  errorsConfig: { [key in string]: string } = {
    minlength: 'Please enter at least two characters!',
    required: 'The field is required',
  };
  doSearch(searchValue: string | null) {
    if (searchValue === null) return;
    const userInput = searchValue.split(',').map((s) => s.trim());
    const searchText = userInput[0];
    const country = userInput.length > 1 ? userInput[1] : undefined;
    this.weatherService.updateCurrentWeatherSignal(searchText, country);
  }
}
