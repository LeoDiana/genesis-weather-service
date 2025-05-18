const fetchWeatherMock = jest.fn();

import request from "supertest";
import app from "../src/app";


jest.mock("../src/services/weather.service", () => ({
    __esModule: true,
    fetchWeather: (city: string) => fetchWeatherMock(city),
}));

describe("GET /api/weather", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return weather data for a valid city", async () => {
        fetchWeatherMock.mockResolvedValue({
            location: { name: "Paris" },
            current: { temp_c: 18 },
        });

        const res = await request(app).get("/api/weather?city=Paris");

        expect(res.status).toBe(200);
        expect(res.body.location.name).toBe("Paris");
        expect(res.body.current.temp_c).toBe(18);
    });

    it("should return 400 if city parameter is missing", async () => {
        const res = await request(app).get("/api/weather");

        expect(res.status).toBe(400);
        expect(res.body.error).toMatch(/city.*required/i);
    });

    it("should return 404 if fetchWeather throws an error", async () => {
        fetchWeatherMock.mockRejectedValue(new Error("API error"));

        const res = await request(app).get("/api/weather?city=InvalidCity");

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/not found|api error/i);
    });
});