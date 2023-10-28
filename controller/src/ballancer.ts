import { CommandType } from './interface';

export class Ballanser {
  private workers: Map<WebSocket, Set<string>> = new Map();
  private symbols: Map<string, WebSocket | null> = new Map();

  addWorker(ws: WebSocket) {
    this.workers.set(ws, new Set());
  }

  addSymbol(symbol: string) {
    if (this.symbols.has(symbol)) {
      return { success: false, descriptions: 'The symbol is already present' };
    }
    this.symbols.set(symbol, null);
    const worker = this.getWorker();
    if (!worker) {
      return { success: false, descriptions: 'There is not worker' };
    }

    this.applySymbolToResource(symbol, worker);

    return { success: true, descriptions: '' };
  }

  getSymbols() {
    return [...this.symbols.keys()];
  }

  removeSymbol(symbol: string) {
    const worker = this.symbols.get(symbol);
    if (worker) {
      const command = { command: CommandType.STOP, body: { symbol } };
      worker.send(JSON.stringify(command));
      const workerSymbols = this.workers.get(worker);
      if (workerSymbols) {
        workerSymbols.delete(symbol);
      }
    }

    this.symbols.delete(symbol);
  }

  getWorker() {
    let selectedWS: WebSocket | undefined;
    let minLength = Number.MAX_VALUE;
    this.workers.forEach((connection, ws) => {
      if (connection.size < minLength) {
        selectedWS = ws;
        minLength = connection.size;
      }
    });
    return selectedWS;
  }

  applySymbolToResource(symbol: string, ws: WebSocket) {
    this.workers.set(ws, this.workers.get(ws)!.add(symbol));
    const command = { command: CommandType.RUN, body: { symbol } };
    ws.send(JSON.stringify(command));
    this.symbols.set(symbol, ws);
  }
}
