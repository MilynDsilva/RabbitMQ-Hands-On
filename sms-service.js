// SmsService
const RabbitMQClient = require('./rabbitmq-client');
const express = require('express');
const app = express();
const port = process.env.PORT || 3002;

const EXCHANGE_NAME = 'order-events';
const QUEUE_NAME = 'sms-notifications';
const rabbitMQ = new RabbitMQClient();

app.use(express.json());

async function start() {
  await rabbitMQ.connect();
  await rabbitMQ.createExchange(EXCHANGE_NAME);
  await rabbitMQ.createQueue(QUEUE_NAME, { 'x-single-active-consumer': true });
  await rabbitMQ.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.created');

  app.listen(port, () => {
    console.log(`SMS Service listening at http://localhost:${port}`);
  });

  rabbitMQ.consumeQueue(QUEUE_NAME, async (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log(`Instance on port ${port} - Sending SMS for order: ${order.id}`);
    // Simulate SMS sending logic
    await rabbitMQ.ackMessage(msg);
  });
}

start();
