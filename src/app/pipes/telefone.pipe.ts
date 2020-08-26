import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefone'
})
export class TelefonePipe implements PipeTransform {

  transform(value) {
    if (value !== null) {
      return value.replace(/(\d{2})(\d{4})(\d{4})/g, '(\$1) \$2\-\$3');
    }

  }

}
