export enum CommandType {
  RUN = 'RUN',
  STOP = 'STOP',
}

export interface Command {
  command: CommandType;
  body: Record<string, any>;
}

export interface IObserver {
  update(data: any): void;
}

export interface ISubject {
  registerObserver(observer: IObserver): void;
  unregisterObserver(observer: IObserver): void;
  notify(data: any): void;
}

export interface priceDate {
  date: Date;
  symbol: string;
  price: number;
}