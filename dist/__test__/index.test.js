"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const index_1 = __importDefault(require("../index"));
let id = "";
let prefilled = {};
const newPost = {
    organization: "node ninja",
    createdAt: new Date(),
    products: ["developers", "pizza"],
    marketValue: "90%",
    address: "sangotedo",
    ceo: "cn",
    country: "Taiwan",
    noOfEmployees: 2,
    employees: ["james bond", "jackie chan"]
};
describe("make a post to database", () => {
    it("should create a new post in the database", async () => {
        const res = await supertest_1.default(index_1.default).post("/api/database").send(newPost);
        expect(res.status).toEqual(201);
        expect(res.body).toHaveProperty("id");
        expect(typeof res.body).toBe("object");
        id = res.body.id;
        prefilled = { ...res.body };
    });
});
describe("update a post on database", () => {
    it("should update a post by ID", async () => {
        newPost.country = "Canada";
        const res = await supertest_1.default(index_1.default).put(`/api/database/${id}`).send(newPost);
        expect(res.status).toEqual(200);
        expect(res.body.country).toBe("Canada");
        prefilled = { ...res.body };
    });
});
describe("Get database content", () => {
    it("should get all posts in database", async () => {
        const res = await supertest_1.default(index_1.default).get("/api/database");
        expect(res.status).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
    });
    it("should get a single post by ID", async () => {
        const res = await supertest_1.default(index_1.default).get(`/api/database/${id}`);
        expect(res.status).toEqual(200);
        expect(typeof res.body).toBe("object");
        expect(res.body).toStrictEqual(prefilled);
    });
});
describe("Delete a post by ID", () => {
    it("should delete a post by ID", async () => {
        const res = await supertest_1.default(index_1.default).delete(`/api/database/${id}`);
        expect(res.body.message).toEqual(`Post with id number ${id} has been deleted`);
        expect(res.status).toEqual(200);
    });
});
describe("Return error for invalid GET request", () => {
    it("should return an error for invalid id", async () => {
        const id = "$";
        const res = await supertest_1.default(index_1.default).get(`/api/database/${id}`);
        expect(res.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("ID NOT FOUND");
    });
});
describe("Return error for invalid POST request", () => {
    it("should return an error for incomplete post fields", async () => {
        const invalidPost = { organization: "Jumia Foods" };
        const res = await supertest_1.default(index_1.default).post("/api/database").send(invalidPost);
        expect(res.status).toEqual(400);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("Please Complete All Required Fields");
    });
});
describe("Return error for non-existent ID", () => {
    it("should return an error for non-existent ID", async () => {
        const res = await supertest_1.default(index_1.default).delete(`/api/database/${id}`);
        expect(res.status).toEqual(404);
        expect(res.body).toHaveProperty("message");
        expect(res.body.message).toBe("ID NOT FOUND");
    });
});
