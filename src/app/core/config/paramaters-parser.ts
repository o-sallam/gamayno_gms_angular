import { HttpParams } from '@angular/common/http';
import { TableFilterBody } from '../../shared/components/table/table';

export class ParamatersParser {
  static parseTableFilter(filterBody?: TableFilterBody): HttpParams {
    let params = new HttpParams();
    if (filterBody) {
      Object.entries(filterBody.filter).forEach(([key, obj]) => {
        if (obj.value !== undefined && obj.value !== null) {
          params = params.set(obj.field, obj.value.toString());
        }
      });
    }

    return params;
  }
}
