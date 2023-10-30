import { WebSocketServer } from 'ws';
import { Ballanser } from './ballancer';
import { APIServer } from './server';

const ballanser: Ballanser = new Ballanser();

const RESTserver = new APIServer(ballanser);

const wss = new WebSocketServer({ server: RESTserver.server.server });

wss.on('connection', function connection(ws: WebSocket) {
  ws.onerror = console.error;
  ballanser.addWorker(ws);

  ws.onmessage = function message(data: any) {
    console.log('received: %s', data);
  };
});

RESTserver.server.listen(
  {
    port: Number.parseInt(process.env.WS_PORT || '8080'),
    host: process.env.WS_HOST || 'localhost',
  },
  (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  }
);
