import { WebsocketAPI } from '@binance/connector-typescript';
import { IObserver, ISubject } from './interface';

type BinancePrice = { symbol: string; price: string };

export class Worker implements ISubject {
  private dataWriters: IObserver[] = [];
  private symbols: string[] = [];
  private websocketStreamClient: WebsocketAPI;

  private callbacks = {
    open: (client: any) => {
      console.debug('Connected with Websocket server');
      setInterval(() => {
        if (this.symbols.length !== 0)
          client.tickerPrice({ symbols: this.symbols });
      }, 1000);
    },
    close: () => console.debug('Disconnected with Websocket server'),
    message: (data: string) => {
      try {
        const parsedData = JSON.parse(data);
        if (parsedData.result && Array.isArray(parsedData.result)) {
          this.notify(
            parsedData.result.map((item: BinancePrice) => ({
              date: new Date(),
              symbol: item.symbol,
              price: Number.parseFloat(item.price),
            }))
          );
        }
      } catch (error) {
        console.error(error);
      }
    },
  };

  constructor() {
    this.websocketStreamClient = new WebsocketAPI('', '', {
      callbacks: this.callbacks,
    });
  }

  addSymbol(symbol: string) {
    if (!this.symbols.includes(symbol)) {
      this.symbols.push(symbol);
    }
  }

  removeSymbol(symbol: string) {
    const index = this.symbols.findIndex((item) => item === symbol);
    if (index >= 0) {
      this.symbols.splice(index, 1);
    }
  }

  registerObserver(observer: IObserver): void {
    this.dataWriters.push(observer);
  }

  unregisterObserver(observer: IObserver): void {
    const index = this.dataWriters.findIndex((o) => o === observer);
    if (index >= 0) {
      this.dataWriters.splice(index, 1);
    }
  }

  notify(data: any): void {
    this.dataWriters.forEach((observer) => {
      observer.update(data);
    });
  }
}
