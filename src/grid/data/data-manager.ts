import { Observable, Subject } from 'rxjs';
import { Query } from './query';
import { GridInternals } from '../grid-internals';

export abstract class DataManager<T extends object> {
  private _beginLoad$ = new Subject<void>();

  private _endLoad$ = new Subject<void>();

  constructor(internals: GridInternals<T>) {
    this.internals = internals;
  }

  public abstract getData(query: Query): Promise<T[]>;

  public get beginLoad$(): Observable<void> {
    return this._beginLoad$;
  }

  public get endLoad$(): Observable<void> {
    return this._endLoad$;
  }

  protected onBeginLoad() {
    this._beginLoad$.next();
  }

  protected onEndLoad() {
    this._endLoad$.next();
  }

  protected readonly internals: Readonly<GridInternals<T>>;
}
