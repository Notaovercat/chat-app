import webpush, { PushSubscription } from "web-push";

class WebPsuhService {
  private publicKey: string;
  private privateKey: string;
  private mailto: string = "mailto:test@test.com";

  constructor() {
    this.privateKey = process.env.PRIVATE_KEY as string;
    this.publicKey = process.env.PUBLIC_KEY as string;
    webpush.setVapidDetails(this.mailto, this.publicKey, this.privateKey);
  }

  async subscribe(sub: PushSubscription) {
    await webpush.sendNotification(sub, "Test").catch((error) => {
      console.log(error);
    });
  }
}

export default new WebPsuhService();
