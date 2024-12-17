export class StopWatch {
  private _stop?: Date;

  private _name?: string;

  constructor(name?: string) {
    this._name = name;
    this.start = new Date();
  }

  public readonly start: Date;

  public stop(): Date {
    return (this._stop = new Date());
  }

  public getTime() {
    return (this._stop ?? new Date()).getTime() - this.start.getTime();
  }

  public report() {
    if (this._name) {
      console.log(`${this._name}: ${this.getTime()}ms`);
    } else {
      console.log(`$${this.getTime()}ms`);
    }
  }
}
