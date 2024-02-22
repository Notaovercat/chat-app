import { PrismaClient } from "@prisma/client";
import webpush, { PushSubscription } from "web-push";

class WebPsuhService {
  private publicKey: string;
  private privateKey: string;
  private mailto: string = "mailto:test@test.com";
  private prisma = new PrismaClient();

  constructor() {
    const vapidKeys = webpush.generateVAPIDKeys();

    this.privateKey = vapidKeys.privateKey;
    this.publicKey = vapidKeys.publicKey;
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
      const subscription = await this.prisma.subscription.findFirstOrThrow({
        where: {
          userId,
        },
      });

      if (!subscription) return;

      const sub: PushSubscription = {
        endpoint: subscription.endpoint,
        keys: {
          auth: subscription.auth,
          p256dh: subscription.p256dh,
        },
      };

      return webpush.sendNotification(sub, JSON.stringify(data));
    } catch (error) {
      console.log(error);
    }
  }
}

export default new WebPsuhService();
