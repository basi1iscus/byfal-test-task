import fastify, { FastifyReply, FastifyRequest } from 'fastify';
import { Ballanser } from './ballancer';

export class APIServer {
  server = fastify();
  ballanser: Ballanser;

  constructor(ballanser: Ballanser) {
    this.ballanser = ballanser;

    this.server.get(
      '/api/v1/symbols',
      async (request: FastifyRequest, reply: FastifyReply) => {
        return reply.send(ballanser.getSymbols());
      }
    );

    this.server.put(
      '/api/v1/symbols/:symbol',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const symbol = (request.params as Record<string, string>).symbol;
        ballanser.addSymbol(symbol);
        return reply.send(ballanser.getSymbols());
      }
    );

    this.server.delete(
      '/api/v1/symbols/:symbol',
      async (request: FastifyRequest, reply: FastifyReply) => {
        const symbol = (request.params as Record<string, string>).symbol;
        ballanser.removeSymbol(symbol);
        return reply.send(ballanser.getSymbols());
      }
    );
  }
}
