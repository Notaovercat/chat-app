import { Request, Response } from "express";
import { PushSubscription } from "web-push";
import WebPushService from "../utils/webpush-service";
import { errorHandler } from "../utils/errorsHandler";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const handleSubscribe = async (req: Request, res: Response) => {
  try {
    const sub: PushSubscription = req.body["subscription"];
    const userId = req.body["userId"];

    const isSub = await prisma.subscription.findFirst({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (!isSub) {
      await WebPushService.subscribe(sub);

      await prisma.subscription.create({
        data: {
          auth: sub.keys.auth,
          p256dh: sub.keys.p256dh,
          endpoint: sub.endpoint,
          user: {
            connect: { id: userId },
          },
        },
      });
      return res.status(201).json({ status: true });
    } else {
      return res.status(200).json({ status: false });
    }
  } catch (err) {
    const { errorMessage, code } = errorHandler(err);
    return res.status(code).json({ message: errorMessage });
  }
};

// export const handleNotification = async (req: Request, res: Response) => {
//   try {
//     await WebPushService.sendNotification(req.user.id, {
//       title: "Test",
//       body: "Test Test",
//     });
//     return res.status(200).json({ status: true });
//   } catch (err) {
//     const { errorMessage, code } = errorHandler(err);
//     return res.status(code).json({ message: errorMessage });
//   }
// };
