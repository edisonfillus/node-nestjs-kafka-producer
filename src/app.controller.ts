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