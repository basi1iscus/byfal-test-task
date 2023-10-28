import WebSocket from 'ws';
import { Command } from './interface';
import { Worker } from './worker';

const worker = new Worker();

const ws = new WebSocket('ws://localhost:8080/');
ws.on('error', console.error);

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
