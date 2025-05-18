import { Request, Response } from "express";
import prisma from "../lib/prisma";

export const unsubscribe = async (req: Request, res: Response) => {
  const { token } = req.params;

  if (!token) {
    res.status(400).json({ error: "Token is required" });
    return;
  }

  try {
    const subscription = await prisma.subscription.findUnique({
      where: { token },
    });

    if (!subscription) {
      res.status(404).send("Invalid or expired unsubscribe link.");
      return;
    }

    await prisma.subscription.delete({
      where: { token },
    });

    res.send("You have been unsubscribed successfully.");
  } catch (err) {
    console.error("Unsubscribe error:", err);
    res.status(500).json({ error: "Server error" });
  }
};
