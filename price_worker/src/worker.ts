import { WebsocketAPI } from '@binance/connector-typescript';

export class Worker {
  symbols: string[] = [];
  callbacks = {
    open: (client: any) => {
      console.debug('Connected with Websocket server');
      setInterval(() => {
        if (this.symbols.length !== 0)
          client.tickerPrice({ symbols: this.symbols });
      }, 1000);
    },
    close: () => console.debug('Disconnected with Websocket server'),
    message: (data: string) => console.info(data),
  };

  websocketStreamClient = new WebsocketAPI('', '', {
    callbacks: this.callbacks,
  });

  addSymbol(symbol: string) {
    if (!this.symbols.includes(symbol)) {
      this.symbols.push(symbol);
      //this.websocketStreamClient.tickerPrice({ symbols: this.symbols });
    }
  }

  removeSymbol(symbol: string) {
    const index = this.symbols.findIndex((item) => item === symbol);
    if (index >= 0) {
      this.symbols.splice(index, 1);
    }
  }
}
