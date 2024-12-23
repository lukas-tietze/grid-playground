import { NormalizedColumnOptions } from './options';
import { BehaviorSubject, Observable } from 'rxjs';

export class ColumnData<T extends object> {
  private _width$ = new BehaviorSubject<number>(150);

  constructor(options: NormalizedColumnOptions<T>) {
    this.options = options;
  }

  public readonly options: NormalizedColumnOptions<T>;

  public get width(): number {
    return this._width$.value;
  }

  public set width(value: number) {
    this._width$.next(value);
  }

  public get width$(): Observable<number> {
    return this._width$;
  }
}
