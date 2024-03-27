import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
    transform(value: string[] | null | any): string[] | null | any {
        if (!value) {
          return value;
        }
    
        return value.map((item: any) => {
          if (item.length > 15) {
            return item.substring(0, 25) + '...'; // Truncate to 7 characters and add ellipsis
          }
          return item;
        });
      }
}