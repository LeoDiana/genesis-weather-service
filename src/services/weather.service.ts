import axios from "axios";
import {WeatherData} from "../types";
import {config} from "../config";

export const fetchWeather = async (city: string): Promise<WeatherData> => {
    const url = `http://api.weatherapi.com/v1/current.json?key=${config.weatherApiKey}&q=${encodeURIComponent(city)}`;

    const response = await axios.get(url);
    const data = response.data;

    return {
        temperature: data.current.temp_c,
        humidity: data.current.humidity,
        description: data.current.condition.text,
    };
};