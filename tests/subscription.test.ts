jest.mock("../src/services/email.service", () => ({
    sendConfirmationEmail: jest.fn().mockResolvedValue(true),
}));

const createMock = jest.fn();
const findFirstMock = jest.fn();


jest.mock("../src/lib/prisma", () => ({
    __esModule: true,
    default: {
        subscription: {
            findFirst: findFirstMock,
            create: createMock,
        },
    },
}));

import request from "supertest";
import app from "../src/app";

describe("POST /api/subscribe", () => {
    it("should return 400 if body is invalid", async () => {
        const res = await request(app).post("/api/subscribe").send({});
        expect(res.status).toBe(400);
    });

    it("should return 200 and confirmation message for valid input", async () => {
        const res = await request(app)
            .post("/api/subscribe")
            .send({
                email: "test@example.com",
                city: "Paris",
                frequency: "daily",
            });

        console.log(res.body);
        expect(res.status).toBe(200);
        expect(res.body.message).toMatch(/confirm/i);
    });

    it("should return 409 if already subscribed", async () => {
        findFirstMock.mockResolvedValue({ id: 1 }); // 👈 simulate duplicate

        const res = await request(app)
            .post("/api/subscribe")
            .send({
                email: "test@example.com",
                city: "Paris",
                frequency: "daily",
            });

        expect(res.status).toBe(409);
        expect(res.body.error).toMatch(/already/i);
    });

    it("should return 500 if DB fails on create", async () => {
        findFirstMock.mockResolvedValue(null);
        createMock.mockRejectedValue(new Error("DB insert failed")); // 👈 simulate error

        const res = await request(app)
            .post("/api/subscribe")
            .send({
                email: "test@example.com",
                city: "Paris",
                frequency: "daily",
            });

        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/server/i);
    });
});