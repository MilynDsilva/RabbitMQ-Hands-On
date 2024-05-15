const amqp = require('amqplib');

class RabbitMQClient {
  constructor(url = 'amqp://localhost') { //TODO url from env
    this.url = url;
    this.connection = null;
    this.channel = null;
  }

  async initialize() {
    if (!this.connection) {
      this.connection = await amqp.connect(this.url);
      this.channel = await this.connection.createChannel();
    }
  }

  async createQueue(queue) {
    await this.initialize();
    await this.channel.assertQueue(queue, { durable: true });
  }

  async publish(queue, message) {
    await this.createQueue(queue);
    this.channel.sendToQueue(queue, Buffer.from(message), {
      persistent: true,
    });
    console.log(`[x] Sent ${message}`);
  }

  async consume(queue, jobName, jobFunction) {
    await this.createQueue(queue); // if consumer starts first then it will create the queue
    this.channel.consume(queue, async (msg) => {
      if (msg !== null) {
        console.log(`[x] Received ${msg.content.toString()}`);
        try {
          await jobFunction(msg.content.toString());
          this.channel.ack(msg); // Removes job from queue
          console.log(`[x] ${jobName} processed successfully`);
        } catch (err) {
          console.error(`[!] Error processing ${jobName}: ${err.message}`);
          // To nack the message to requeue it , uncomment below line
          // this.channel.nack(msg);
        }
      }
    }, {
      noAck: false
    });
  }
}

module.exports = RabbitMQClient;
