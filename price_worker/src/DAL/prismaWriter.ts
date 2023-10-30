import { IObserver, priceDate } from '../interface';
import { PrismaClient } from '@prisma/client';

export class PrismaWriter implements IObserver {
  prisma;
  constructor() {
    this.prisma = new PrismaClient();
  }

  async connect(): Promise<boolean> {
    return true;
  }

  private writeToDB(data: priceDate[]): void {
    for (const item of data) {
      this.prisma.binancePrices
        .create({
          data: {
            symbol: item.symbol,
            date: item.date,
            price: item.price,
          },
        })
        .catch(console.error);
    }
  }

  update(data: priceDate[]): void {
    this.writeToDB(data);
  }
}
