require('dotenv').config({
  path: ['.env', '.env.local'],
} satisfies DotenvConfigOptions)

import { ValidationPipe } from '@nestjs/common'
import { NestFactory, Reflector } from '@nestjs/core'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'
import * as bodyParser from 'body-parser'
import type { DotenvConfigOptions } from 'dotenv'
import helmet from 'helmet'
import { AppModule } from './App.module'
import { ConfigService, FormatResponseInterceptor } from './lib/nestjs-utils'
import rateLimit from 'express-rate-limit'

const rawBody = (req: any, res: any, buf: Buffer, encoding: any) => {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8')
  }
}

function getCorsOrigins(): string[] | string {
  const origins = process.env.CORS_ORIGINS
  if (!origins || origins === '*') {
    // In production, this should be explicitly configured
    if (process.env.NODE_ENV === 'production') {
      throw new Error('CORS_ORIGINS must be explicitly configured in production')
    }
    return 'http://localhost:3000'
  }
  return origins.split(',').map(origin => origin.trim())
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: getCorsOrigins(),
      credentials: true,
    },
  })
  app.enableShutdownHooks()

  app.use(helmet({}))
  
  // Add rate limiting
  app.use(
    rateLimit({
      windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000', 10), // 15 minutes default
      max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100', 10), // limit each IP to 100 requests per windowMs
      message: 'Too many requests from this IP, please try again later.',
      standardHeaders: true,
      legacyHeaders: false,
    }),
  )
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  )

  const configService = app.get(ConfigService)

  app.setGlobalPrefix(configService.get<string>('server.globalPrefix') || '')
  app.useGlobalInterceptors(
    new FormatResponseInterceptor(app.get(Reflector)) as any,
  )

  app.use(bodyParser.urlencoded({ verify: rawBody, extended: true }))
  app.use(
    bodyParser.json({
      verify: rawBody,
      limit: parseInt(process.env.BODY_PARSER_LIMIT || '1048576', 10), // 1MB default, configurable via env
    }),
  )

  // setup swagger
  if (!!Number(configService.get<string>('swagger.active'))) {
    const options = new DocumentBuilder()
      .setTitle('Unbody')
      .setDescription(`Unbody`)
      .addBearerAuth({ in: 'header', type: 'http' }, 'Authorization')
      .setVersion('1.0')
      .build()

    const document = SwaggerModule.createDocument(app, options)
    SwaggerModule.setup(
      configService.get('swagger.path') || '/swagger',
      app,
      document,
    )
  }

  await app.listen(
    configService.get<string>('server.port')!,
    configService.get<string>('server.hostname')!,
  )
}
bootstrap()
