const findUniqueMock = jest.fn();
const updateMock = jest.fn();

import request from "supertest";
import app from "../src/app";

jest.mock("../src/lib/prisma", () => ({
    __esModule: true,
    default: {
        subscription: {
            findUnique: findUniqueMock,
            update: updateMock,
        },
    },
}));

describe("GET /api/confirm/:token", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should confirm a valid subscription token", async () => {
        findUniqueMock.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            token: "valid-token",
            confirmed: false,
        });

        updateMock.mockResolvedValue({ id: 1 });

        const res = await request(app).get("/api/confirm/valid-token");

        expect(res.status).toBe(200);
        expect(res.text).toMatch(/confirmed/i);
        expect(findUniqueMock).toHaveBeenCalledWith({ where: { token: "valid-token" } });
        expect(updateMock).toHaveBeenCalledWith({
            where: { token: "valid-token" },
            data: { confirmed: true, token: null },
        });
    });

    it("should return 404 for invalid token", async () => {
        findUniqueMock.mockResolvedValue(null);

        const res = await request(app).get("/api/confirm/bad-token");

        expect(res.status).toBe(404);
        expect(res.body.error).toMatch(/invalid/i);
    });

    it("should return 400 if no token is provided", async () => {
        const res = await request(app).get("/api/confirm/");

        expect([400, 404]).toContain(res.status);
    });

    it("should return 500 on DB failure", async () => {
        findUniqueMock.mockResolvedValue({
            id: 1,
            email: "test@example.com",
            token: "valid-token",
            confirmed: false,
        });

        updateMock.mockRejectedValue(new Error("DB error"));

        const res = await request(app).get("/api/confirm/valid-token");

        expect(res.status).toBe(500);
        expect(res.body.error).toMatch(/server/i);
    });
});