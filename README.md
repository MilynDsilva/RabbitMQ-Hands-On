# RabbitMQ-Hands-On

## Overview

Basic RabbitMQ Hands On Example.

## Getting Started

To run this project, follow these steps:

### Step 1: Docker Compose

1. Open a terminal and navigate to the project directory.
2. Run the following command:

docker-compose up

### Step 2: Accessing RabbitMQ Dashboard

1. Once the Docker containers are up and running, open a web browser.
2. Enter the following URL in the address bar:

http://localhost:15672/


### Step 3: RabbitMQ Dashboard Credentials

- **Username:** guest
- **Password:** guest

## Additional Notes

Any additional notes or instructions can be added here.

## Reference

- [Setting up RabbitMQ with Docker Compose](https://x-team.com/blog/set-up-rabbitmq-with-docker-compose/)

Start multiple servers of same service using 

PORT=3002 node sms-service.js
PORT=3003 node sms-service.js
PORT=3004 node sms-service.js

Post Request to create an order:

curl --location 'http://localhost:3000/publish' \
--header 'Content-Type: application/json' \
--data '{"id": 4, "description": "cake2"}'