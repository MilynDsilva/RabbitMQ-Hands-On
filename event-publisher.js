// EventPublisher
const RabbitMQClient = require('./rabbitmq-client');
const express = require('express');
const app = express();
const port = 3000;

const EXCHANGE_NAME = 'order-events';
const rabbitMQ = new RabbitMQClient();

app.use(express.json());

app.post('/publish', async (req, res) => {
    const event = req.body;
    await rabbitMQ.sendToExchange(EXCHANGE_NAME, 'order.created', JSON.stringify(event));
    res.send({ result: 'Event published to exchange' });
});

async function start() {
    await rabbitMQ.connect();
    await rabbitMQ.createExchange(EXCHANGE_NAME);

    app.listen(port, () => {
        console.log(`Event Publisher listening at http://localhost:${port}`);
    });
}

start();
