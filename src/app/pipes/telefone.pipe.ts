import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone',
})
export class TelefonePipe implements PipeTransform {
  transform(value) {
    if (value !== null) {
      if (value.length > 10) {
        return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, '($1) $2 $3-$4');
      } else {
        return value.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
      }
    }
  }
}
