import WebSocket from 'ws';
import { Command } from './interface';
import { Worker } from './worker';
import { ConsoleWriter } from './DAL/consoleWriter';
import { RedisWriter } from './DAL/redisWriter';
import { PrismaWriter } from './DAL/prismaWriter';

const worker = new Worker();
worker.registerObserver(new ConsoleWriter());
const redisWriter = new RedisWriter();
redisWriter.connect().then(() => worker.registerObserver(redisWriter));
worker.registerObserver(new PrismaWriter());

const ws = new WebSocket(process.env.WS_URL || 'ws://localhost:8080/');
ws.on('error', (err: any) => {
  console.error(err);
});


ws.on('open', function open() {
  console.log('connected');
  ws.send(Date.now());
});

ws.on('close', function close() {
  console.log('disconnected');
});

ws.on('message', function message(data: Command) {
  try {
    console.log(data);
    data = JSON.parse(data.toString());
    if (data.command === 'RUN') {
      worker.addSymbol(data.body.symbol);
    } else if (data.command === 'STOP') {
      worker.removeSymbol(data.body.symbol);
    }
  } catch (e) {
    console.error(e);
  }
});
