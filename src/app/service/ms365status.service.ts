import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { retry, Subject } from 'rxjs';
import { Ms365status, Ms365statusEntity } from '../entity/ms365status.entity';

const FUNC_URL =
  'https://ms365-checker.azurewebsites.net/api/dns-resolve-bridge';
const FUNC_CODE = 'fan90DtpLQvbd8G8v2MkPFa/sDyuaGxVK6eXuwSinm7v1GMdg7oG5w==';

const MS365_MX_POSTFIX = '.outlook.com';

interface FuncResponse {
  result: 'OK' | 'NG';
  hostname: string;
  rrtype: string;
  records: Array<any>;
}

interface MxRecord {
  exchange: string;
  priority: number;
}

const isMxRecord = (value: any): value is MxRecord =>
  value != null && 'exchange' in value;

const isMs365MxRecord = (value: Array<any>): boolean =>
  value.some(
    (x) => isMxRecord(x) && x.exchange.toLowerCase().endsWith(MS365_MX_POSTFIX)
  );

@Injectable({
  providedIn: 'root',
})
export class Ms365statusService {
  constructor(private http: HttpClient) {}

  lookup(hostname: string): Ms365statusEntity {
    const params = new HttpParams().appendAll({
      code: FUNC_CODE,
      hostname,
      rrtype: 'MX',
    });

    const status = new Subject<Ms365status>();
    const rawResult = new Subject<any>();
    const ret: Ms365statusEntity = {
      hostname,
      status$: status,
      rawResult$: rawResult,
    };

    this.http
      .get<FuncResponse>(FUNC_URL, { params })
      .pipe(retry(3))
      .subscribe({
        next: (value) => {
          rawResult.next(value);
          rawResult.complete();

          if (value.result === 'OK' && value.records.length > 0) {
            status.next(isMs365MxRecord(value.records) ? '導入済み' : '未導入');
          } else {
            status.next('エラー');
          }
          status.complete();
        },
        error: (err) => {
          rawResult.next(err);
          rawResult.complete();
          status.next('エラー');
          status.complete();
        },
      });

    return ret;
  }
}
