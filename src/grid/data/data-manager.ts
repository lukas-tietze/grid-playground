import { Observable, Subject } from 'rxjs';
import { Query } from './query';

export abstract class DataManager<T extends object> {
  private _beginLoad$ = new Subject<void>();

  private _endLoad$ = new Subject<void>();

  public abstract handleChangedQuery(query: Query): void;

  public get beginLoad$(): Observable<void> {
    return this._beginLoad$;
  }

  public get endLoad$(): Observable<void> {
    return this._endLoad$;
  }

  public abstract get data$(): Observable<T[]>;

  protected onBeginLoad() {
    this._beginLoad$.next();
  }

  protected onEndLoad() {
    this._endLoad$.next();
  }
}
