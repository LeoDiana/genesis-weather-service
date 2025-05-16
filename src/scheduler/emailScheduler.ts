import cron from "node-cron";
import { sendWeatherEmail } from "../utils/sendWeatherEmail";
import prisma from "../lib/prisma";

export function startEmailScheduler() {
  cron.schedule("0 * * * *", async () => {
    console.log("Sending hourly emails...");
    await sendEmailsByFrequency("hourly");
  });

  // Every day at 9:00 AM
  cron.schedule("0 9 * * *", async () => {
    console.log("Sending daily emails...");
    await sendEmailsByFrequency("daily");
  });
}

async function sendEmailsByFrequency(frequency: "daily" | "hourly") {
  const subscribers = await prisma.subscription.findMany({
    where: {
      confirmed: true,
      frequency,
    },
  });

  for (const sub of subscribers) {
    try {
      await sendWeatherEmail(sub.email, sub.city);
      console.log(`Sent to ${sub.email} (${sub.city})`);
    } catch (err) {
      console.error(`Failed to send to ${sub.email}`, err);
    }
  }
}
