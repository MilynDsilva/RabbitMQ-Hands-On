// UserService
const RabbitMQClient = require('./rabbitmq-client');
const express = require('express');
const app = express();
const port = process.env.PORT || 3001;

const EXCHANGE_NAME = 'order-events';
const QUEUE_NAME = 'user-orders';
const rabbitMQ = new RabbitMQClient();

app.use(express.json());

async function start() {
  await rabbitMQ.connect();
  await rabbitMQ.createExchange(EXCHANGE_NAME);
  await rabbitMQ.createQueue(QUEUE_NAME);
  await rabbitMQ.bindQueue(QUEUE_NAME, EXCHANGE_NAME, 'order.created');

  app.listen(port, () => {
    console.log(`User Service listening at http://localhost:${port}`);
  });

  rabbitMQ.consumeQueue(QUEUE_NAME, async (msg) => {
    const order = JSON.parse(msg.content.toString());
    console.log(`Processing order: ${order.id}`);
    // Process order here
    await rabbitMQ.ackMessage(msg);
  });
}

start();
