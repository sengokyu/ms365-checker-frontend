import { Observable } from 'rxjs';

export type Ms365status = '導入済み' | '未導入' | 'エラー';

export interface Ms365statusEntity {
  hostname: string;
  status$: Observable<Ms365status>;
  rawResult$: Observable<any>;
}
