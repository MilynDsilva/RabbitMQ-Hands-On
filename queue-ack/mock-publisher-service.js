const RabbitMQClient = require('./rabbitmq-client');
const client = new RabbitMQClient();

(async () => {
  await client.publish('event_queue', 'some data');
})();
