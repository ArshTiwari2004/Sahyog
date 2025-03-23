const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Kafka producer
const kafka = new Kafka({
  clientId: 'sahyog-data-producer',
  brokers: [process.env.KAFKA_BROKER || 'localhost:9092']
});

const producer = kafka.producer();

// Function to send data to Kafka
async function sendToKafka(topic, message) {
  try {
    await producer.connect();
    await producer.send({
      topic,
      messages: [
        { value: JSON.stringify(message) }
      ],
    });
    console.log(`Message sent to topic ${topic}`);
    return true;
  } catch (error) {
    console.error('Error sending message to Kafka:', error);
    return false;
  } finally {
    await producer.disconnect();
  }
}

module.exports = { sendToKafka };