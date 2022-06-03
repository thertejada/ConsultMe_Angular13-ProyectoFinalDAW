import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'url'
})
export class UrlPipe implements PipeTransform {
  transform(url: string): string {
    if (!/^https?:\/\//i.test(url)) {
      return `http://${url}`;
    }
    return url;
  }
}
