import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const confirmSubscription = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({ error: "Token is required" });
    return;
  }

  const subscription = await prisma.subscription.findUnique({
    where: { token },
  });

  if (!subscription) {
    res.status(404).json({ error: "Invalid or expired token" });
    return;
  }

  await prisma.subscription.update({
    where: { token },
    data: {
      confirmed: true,
      token: null, // Invalidate the token
    },
  });

  res.send("Subscription confirmed! You will now receive weather updates.");
};
