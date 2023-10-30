import { IObserver } from '../interface';

export class ConsoleWriter implements IObserver {
  update(data: any): void {
    console.info(data);
  }
}
