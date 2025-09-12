import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ConfirmData } from '../../../models/ConfirmData';

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  private _confirmState = new BehaviorSubject<ConfirmData | null>(null);
  confirmState$ = this._confirmState.asObservable();

  private _resolver?: (result: boolean) => void;

  confirm(data: ConfirmData): Promise<boolean> {
    this._confirmState.next(data);
    return new Promise(resolve => {
      this._resolver = resolve;
    });
  }

  resolve(result: boolean) {
    if (this._resolver) {
      this._resolver(result);
      this._resolver = undefined;
    }
    this._confirmState.next(null);
  }
}
