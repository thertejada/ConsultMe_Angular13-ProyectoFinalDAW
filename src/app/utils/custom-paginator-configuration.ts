import { MatPaginatorIntl } from '@angular/material/paginator';

export function CustomOrderPaginator() {
  const customPaginatorIntl = new MatPaginatorIntl();

  customPaginatorIntl.itemsPerPageLabel = 'Pedidos por página';
  customPaginatorIntl.previousPageLabel = 'Página anterior';
  customPaginatorIntl.nextPageLabel = 'Página siguiente';
  customPaginatorIntl.firstPageLabel = 'Primera página';
  customPaginatorIntl.lastPageLabel = 'Última página';
  const superGetRangeLabel = customPaginatorIntl.getRangeLabel;
  customPaginatorIntl.getRangeLabel = (page: number, pageSize: number, length: number) => {
    return `${superGetRangeLabel(page, pageSize, length)?.replace('of', 'de')}`;
  };

  return customPaginatorIntl;
}
