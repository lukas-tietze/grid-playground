import { Observable, Subject } from 'rxjs';

export class Component {
  private readonly _destroy$ = new Subject<void>();

  protected get destroy$(): Observable<void> {
    return this._destroy$;
  }

  public dispose() {
    this._destroy$.next();
    this._destroy$.complete();
  }
}
