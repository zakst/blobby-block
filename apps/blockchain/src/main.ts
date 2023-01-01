import { ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { BlockchainModule } from './blockchain.module'
const port = process.env.PORT

async function bootstrap() {
  const app = await NestFactory.create(BlockchainModule)
  app.useGlobalPipes(new ValidationPipe())
  console.log(port)
  await app.listen(port)
}
bootstrap()
