import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'RG',
})
export class RgPipe implements PipeTransform {
  transform(value) {
    if (value !== null) {
      return value.replace(/(\d{2})(\d{3})(\d{3})(\d{1})/g, '$1.$2.$3-$4');
    }
  }
}
