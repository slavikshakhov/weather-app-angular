import { Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';

@Pipe({
  name: 'objectToKeys',
  standalone: true,
})
export class ObjectToKeysPipe implements PipeTransform {
  transform(value: ValidationErrors | undefined, ...args: unknown[]): string[] | null {
    return value ? Object.keys(value) : null;
  }
}
