# NestJs boilerplate for Kafka Producer 

## Create from scratch
Create project
```bash
$ npm i -g @nestjs/cli
$ nest new project-name
```
Install Microservices and Kafka
```bash
npm install --save @nestjs/microservices kafkajs
```
Update the app.module.ts to include Kafka Configuration
```typescript
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'kafkaSample',
            brokers: ['localhost:9092'],
          },
          consumer: {
            groupId: 'my-kafka-consumer', // Should be the same thing we give in consumer
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
}
```
Change the app.controller.ts to implements OnModuleInit, OnModuleDestroy and inject ClientKafka
```typescript
import { Controller, Inject, OnModuleDestroy, OnModuleInit, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {

  constructor(@Inject('KAFKA_SERVICE') private readonly kafka: ClientKafka) {
  }

  async onModuleInit() {
    this.kafka.subscribeToResponseOf('my-first-topic');
    await this.kafka.connect();
  }

  onModuleDestroy() {
    this.kafka.close();
  }

  @Post()
  async postHello() {
    return this.kafka.send('my-first-topic', 'Hello Kafka');
  }

}
```
Run the application and POST on http://localhost:3000/


## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```