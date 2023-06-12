import { PrismaClient } from "@prisma/client";
import webpush, { PushSubscription } from "web-push";

class WebPsuhService {
  private publicKey: string;
  private privateKey: string;
  private mailto: string = "mailto:test@test.com";
  private prisma = new PrismaClient();

  constructor() {
    this.privateKey = process.env.VAPID_PRIVATE_KEY as string;
    this.publicKey = process.env.VAPID_PUBLIC_KEY as string;
    webpush.setVapidDetails(this.mailto, this.publicKey, this.privateKey);
  }

  // SUBSCRIBE USER TO A NOTIFICATIONS
  async subscribe(sub: PushSubscription) {
    try {
      return webpush.sendNotification(sub, "Test");
    } catch (error) {
      console.log(error);
    }
  }

  async sendNotification(
    userId: string,
    data: { title: string; body: string }
  ) {
    try {
      // FIND SUB BY USER ID
      const subscription = await this.prisma.subscription.findFirstOrThrow({
        where: {
          userId,
        },
      });

      if (subscription) {
        const sub: PushSubscription = {
          endpoint: subscription.endpoint,
          keys: {
            auth: subscription.auth,
            p256dh: subscription.p256dh,
          },
        };

        // SEND NOTIFICATION
        const payload = JSON.stringify(data);

        return webpush.sendNotification(sub, payload);
      } else {
        return;
      }
    } catch (error) {
      console.log(error);
    }
  }
}

export default new WebPsuhService();
