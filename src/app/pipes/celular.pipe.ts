import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'celular'
})
export class CelularPipe implements PipeTransform {

  transform(value) {
    if (value !== null) {
      return value.replace(/(\d{2})(\d{1})(\d{4})(\d{4})/g, '(\$1) \$2 $3\-\$4');
    }

  }

}
