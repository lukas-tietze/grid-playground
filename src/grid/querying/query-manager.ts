import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { Query } from '../data/query';

export class QueryManager {
  private _query$ = new BehaviorSubject<Query>({
    filters: [],
    ordering: [],
    pagination: undefined,
  });

  public get query(): Observable<Query> {
    return this._query$;
  }
}
