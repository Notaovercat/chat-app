import { emit } from "process";
import webpush from "web-push";

// export const subscribe = async () => {
//   const payload = JSON.stringify({ title: "Test" });
//   const

//   webpush.setVapidDetails('mailto:test@test.com', )
// };

class WebPsuhService {
  private publicKey: string;
  private privateKey: string;
  private mailto: string = "mailto:test@test.com";

  constructor() {
    this.privateKey = process.env.PRIVATE_KEY as string;
    this.publicKey = process.env.PUBLIC_KEY as string;
    webpush.setVapidDetails(this.mailto, this.publicKey, this.privateKey);
  }

  subscribe() {}
}

export default new WebPsuhService();
