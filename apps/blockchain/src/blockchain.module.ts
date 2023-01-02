import { Module } from '@nestjs/common'
import { BlockchainController } from './blockchain.controller'
import { LoggerModule } from 'nestjs-pino'

@Module({
  imports: [LoggerModule.forRoot({
    pinoHttp: {
      serializers: {
        req: (req) => ({
          url: req.url
        })
      },
      autoLogging: false,
      level:  process.env.LOG_LEVEL || 'info',
      transport: {
        target: 'pino-pretty',
        options: {
          colorize: true
        }
      }
    }
  })],
  controllers: [BlockchainController],
  providers: [],
})
export class BlockchainModule {}
