// RabbitMQClient
const amqplib = require('amqplib');

class RabbitMQClient {
  constructor() {
    this.connection = null;
    this.channel = null;
  }

  async connect() {
    this.connection = await amqplib.connect('amqp://localhost');
    this.channel = await this.connection.createChannel();
  }

  async createExchange(exchangeName, type = 'topic') {
    await this.channel.assertExchange(exchangeName, type, { durable: true });
  }

  async createQueue(queueName, options = {}) {
    await this.channel.assertQueue(queueName, { durable: true, ...options });
  }

  async bindQueue(queueName, exchangeName, pattern) {
    await this.channel.bindQueue(queueName, exchangeName, pattern);
  }

  async sendToExchange(exchangeName, routingKey, message) {
    // Ensure the exchange exists before publishing
    await this.createExchange(exchangeName);
    await this.channel.publish(exchangeName, routingKey, Buffer.from(message), { persistent: true });
  }

  async consumeQueue(queueName, callback) {
    await this.channel.consume(queueName, callback, { noAck: false });
  }

  async ackMessage(msg) {
    this.channel.ack(msg);
  }

  async close() {
    await this.channel.close();
    await this.connection.close();
  }
}

module.exports = RabbitMQClient;
