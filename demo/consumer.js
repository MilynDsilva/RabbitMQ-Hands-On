const amqp = require("amqplib");

async function connect() {
    try {
        const connection = amqp.connect("amqp://localhost:5672");
        const channel = (await connection).createChannel();
        (await channel).consume("jobs", async message => {
            console.log(JSON.parse(message.content.toString()));
            (await channel).ack(message);
        })
        console.log("Consumer here!")
    } catch (error) {
        console.error(`Error ${error}`)
    }
}

connect();