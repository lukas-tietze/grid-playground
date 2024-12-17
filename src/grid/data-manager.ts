import { BehaviorSubject, Observable, Subject } from 'rxjs';

export class DataManager<T extends object> {
  private _data$ = new BehaviorSubject<T[]>([]);

  public get data(): readonly T[] {
    return this._data$.value;
  }

  public set data(data: T[]) {
    this._data$.next(data);
  }

  public watch$(): Observable<T[]> {
    return this._data$;
  }
}
