import { Pipe, PipeTransform } from '@angular/core';

const LENGTH_CHUCNK = 5;

@Pipe({
  name: 'formatCodeOrder'
})
export class FormatCodeOrderPipe implements PipeTransform {
  transform(value: number | string, ...args: any[]): string {
    return (
      value
        ?.toString()
        ?.match(new RegExp('.{1,' + LENGTH_CHUCNK + '}', 'g'))
        ?.reduce((acc: string, chunk: string) => `${acc} ${chunk}`, '')
        ?.trim() ?? ''
    );
  }
}
