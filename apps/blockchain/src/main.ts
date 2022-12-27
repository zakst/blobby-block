import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { BlockchainModule } from './blockchain.module'

async function bootstrap() {
  const app = await NestFactory.create(BlockchainModule)
  app.useGlobalPipes(new ValidationPipe())
  await app.listen(3000)
}
bootstrap()
