const amqp = require("amqplib");

const user = { name: "Some name", age: 29 };

async function connect() {
    try {
        const connection = amqp.connect("amqp://localhost:5672");
        const channel = (await connection).createChannel();
        const result = (await channel).assertQueue("jobs"); //checks if queue exists if not creates one
        (await channel).sendToQueue("jobs", Buffer.from(JSON.stringify(user)));
        console.log("Queued!");
    } catch (error) {
        console.error(`Error ${error}`);
    }
}

connect();