import { consumer } from "./kafka";
import { createOrder } from "./order";

export const runKafkaSubscriptions = async () => {

  consumer.subscribe([
    {
      topicName: "payment.successful",
      topicHandler: async (message) => {
        // const order = message.value;
        // await createOrder(order);
        console.log("Received payment.successful event (handled by API verification):", message.value);
      },
    },
  ]);
};
