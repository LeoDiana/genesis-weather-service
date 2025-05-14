import { Request, Response } from "express";
import { fetchWeather } from "../services/weather.service";

export const getWeather = async (req: Request, res: Response): Promise<void> => {
    const city = req.query.city as string;

    if (!city) {
        res.status(400).json({ error: "City parameter is required" });
        return
    }

    try {
        const weather = await fetchWeather(city);
        res.status(200).json(weather);
    } catch (err) {
        console.error(err);
        res.status(404).json({ error: "City not found or API error" });
    }
};