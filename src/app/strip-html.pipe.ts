// strip-html.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'stripHtml'
})
export class StripHtmlPipe implements PipeTransform {
  transform(value: string): string {
    return value ? value.replace(/<[^>]*>/g, '') : '';
  }
}

