import { IObserver, priceDate } from '../interface';
import { createClient } from 'redis';

export class RedisWriter implements IObserver {
  client;
  constructor() {
    this.client = createClient({
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
    });
  }

  async connect(): Promise<boolean> {
    try {
      await this.client.connect();
      return true;
    } catch {
      console.error('Redis connection failed');
      return false;
    }
  }

  private writeToDB(data: priceDate[]): void {
    for (const item of data) {
      this.client
        .xAdd(item.symbol, item.date.getTime().toString(), {
          price: item.price.toString(),
        })
        .catch(console.error);
    }
  }

  update(data: priceDate[]): void {
    this.writeToDB(data);
  }
}
