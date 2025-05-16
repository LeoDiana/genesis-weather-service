import { Request, Response } from "express";
import prisma from "../lib/prisma";
import { generateToken } from "../utils/token";
import { sendConfirmationEmail } from "../services/email.service";

export const subscribe = async (req: Request, res: Response) => {
    const { email, city, frequency } = req.body;

    if (!email || !city || !["daily", "hourly"].includes(frequency)) {
        res.status(400).json({ error: "Invalid input" });
        return;
    }

    const existing = await prisma.subscription.findFirst({
        where: { email, city },
    });

    if (existing) {
        res.status(409).json({ error: "Email already subscribed for this city" });
        return;
    }

    const token = generateToken();

    try {
        await prisma.subscription.create({
            data: {
                email,
                city,
                frequency,
                token,
            },
        });

        await sendConfirmationEmail(email, token);

        res.status(200).json({ message: "Subscription created. Check your email to confirm." });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Server error" });
    }
};