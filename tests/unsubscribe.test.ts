const findUniqueMock = jest.fn();
const deleteMock = jest.fn();

import request from "supertest";
import app from "../src/app";

jest.mock("../src/lib/prisma", () => ({
    __esModule: true,
    default: {
        subscription: {
            findUnique: findUniqueMock,
            delete: deleteMock,
        },
    },
}));

describe("GET /api/unsubscribe/:token", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should unsubscribe a valid token", async () => {
        findUniqueMock.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            token: "unsubscribe-token",
        });

        deleteMock.mockResolvedValue({ id: 1 });

        const res = await request(app).get("/api/unsubscribe/unsubscribe-token");

        expect(res.status).toBe(200);
        expect(res.text).toMatch(/unsubscribed/i);
        expect(findUniqueMock).toHaveBeenCalledWith({ where: { token: "unsubscribe-token" } });
        expect(deleteMock).toHaveBeenCalledWith({ where: { token: "unsubscribe-token" } });
    });

    it("should return 404 if token is invalid", async () => {
        findUniqueMock.mockResolvedValue(null);

        const res = await request(app).get("/api/unsubscribe/invalid-token");

        expect(res.status).toBe(404);
        expect(res.text).toMatch(/invalid/i);
    });

    it("should return 400 if no token provided", async () => {
        const res = await request(app).get("/api/unsubscribe/");

        expect([400, 404]).toContain(res.status); // Depending on how your router is set up
    });

    it("should return 500 if DB delete fails", async () => {
        findUniqueMock.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            token: "unsubscribe-token",
        });

        deleteMock.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/api/unsubscribe/unsubscribe-token");

        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/server/i);
    });
});