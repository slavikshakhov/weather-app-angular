import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fahrenheitToCelcius',
  standalone: true,
})
export class FahrenheitToCelciusPipe implements PipeTransform {
  transform(fahrenheitValue: number, isFahrenheit: boolean): number {
    return isFahrenheit ? fahrenheitValue : ((fahrenheitValue - 32) * 5) / 9;
  }
}
