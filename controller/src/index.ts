import fastify, { FastifyRequest } from 'fastify';
import { WebSocketServer } from 'ws';
import { Ballanser } from './ballancer';

const ballanser: Ballanser = new Ballanser();

const server = fastify();
const wss = new WebSocketServer({ server: server.server });

wss.on('connection', function connection(ws: WebSocket) {
  ws.onerror = console.error;
  ballanser.addWorker(ws);

  ws.onmessage = function message(data: any) {
    console.log('received: %s', data);
  };

  ws.send('something');
});

server.get('/symbols', async () => {
  return JSON.stringify(ballanser.getSymbols());
});

server.put('/symbols/:symbol', async (request: FastifyRequest) => {
  const symbol = (request.params as Record<string, string>).symbol;
  ballanser.addSymbol(symbol);
  return JSON.stringify(ballanser.getSymbols());
});

server.delete('/symbols/:symbol', async (request: FastifyRequest) => {
  const symbol = (request.params as Record<string, string>).symbol;
  ballanser.removeSymbol(symbol);
  return JSON.stringify(ballanser.getSymbols());
});

server.listen({ port: 8080 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
