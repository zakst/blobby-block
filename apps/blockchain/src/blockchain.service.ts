import { Injectable } from '@nestjs/common';

@Injectable()
export class BlockchainService {
  getHello(): string {
    return 'Hello World!';
  }
}
