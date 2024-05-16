const RabbitMQClient = require('./rabbitmq-client');
const client = new RabbitMQClient();

async function processEvent(message) {
  console.log('Event received:', message);
  //Some business logic
  await new Promise(resolve => setTimeout(resolve, 1000));
}

(async () => {
  await client.consume('event_queue', 'event_processing', processEvent);
})();

// To replace event emmiter with rabbitmq use queue name as eventcode, jobname just to log, and executabe function
