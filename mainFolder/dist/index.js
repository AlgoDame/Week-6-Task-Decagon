"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const app = express_1.default();
app.use(express_1.default.json()); // Body parser middleware
const databasePath = path_1.default.join(__dirname, "database.json");
let database;
// Get request without id
app.get("/api/database", (req, res) => {
    fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
        if (err)
            return res.status(500).send({
                status: "Error",
                message: err.message
            });
        database = JSON.parse(data);
        res.send(database);
    });
});
// Get request with id
app.get("/api/database/:id", (req, res) => {
    const post = database.find((p) => p.id === parseInt(req.params.id));
    if (!post)
        return res.status(404).send({ message: "ID NOT FOUND" });
    res.send(post);
});
// Post request
app.post("/api/database", (req, res) => {
    if (!req.body.organization || !req.body.products || !req.body.marketValue || !req.body.address ||
        !req.body.ceo || !req.body.country || !req.body.noOfEmployees || !req.body.employees) {
        return res.status(400).send({ message: "Please Complete All Required Fields" });
    }
    fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
        if (err)
            return res.status(500).send({
                status: "Error",
                message: err.message
            });
        const database = JSON.parse(data);
        const lastID = database[database.length - 1].id;
        const newPost = {
            id: lastID + 1,
            organization: req.body.organization,
            createdAt: new Date(),
            products: req.body.products,
            marketValue: req.body.marketValue,
            address: req.body.address,
            ceo: req.body.ceo,
            country: req.body.country,
            noOfEmployees: req.body.noOfEmployees,
            employees: req.body.employees
        };
        database.push(newPost);
        writeToDatabase(databasePath, database);
        res.status(201).send(newPost);
    });
});
// Put request
app.put("/api/database/:id", (req, res) => {
    fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
        if (err)
            return res.status(500).send({
                status: "Error",
                message: err.message
            });
        const database = JSON.parse(data);
        const post = database.find((p) => p.id === parseInt(req.params.id));
        if (!post)
            return res.status(404).send("ID NOT FOUND");
        if (!req.body.organization || !req.body.products || !req.body.marketValue || !req.body.address ||
            !req.body.ceo || !req.body.country || !req.body.noOfEmployees || !req.body.employees) {
            return res.status(400).send({ message: "Please Complete All Required Feilds" });
        }
        if (post) {
            post.organization = req.body.organization;
            post.createdAt = req.body.createdAt;
            post.updatedAt = new Date();
            post.products = req.body.products;
            post.marketValue = req.body.marketValue;
            post.address = req.body.address;
            post.ceo = req.body.ceo;
            post.country = req.body.country;
            post.noOfEmployees = req.body.noOfEmployees;
            post.employees = req.body.employees;
            const index = database.findIndex((item) => item.id === post.id);
            database[index] = { ...post };
            writeToDatabase(databasePath, database);
            res.status(200).send(post);
        }
    });
});
// Delete request
app.delete("/api/database/:id", (req, res) => {
    fs_1.default.readFile(databasePath, "utf-8", (err, data) => {
        if (err)
            return res.status(500).send({
                status: "Error",
                message: err.message
            });
        const database = JSON.parse(data);
        const post = database.find((p) => p.id === parseInt(req.params.id));
        if (!post)
            return res.status(404).send({ message: "ID NOT FOUND" });
        if (post) {
            const index = database.indexOf(post);
            database.splice(index, 1);
            writeToDatabase(databasePath, database);
        }
        res.status(200).send({ message: `Post with id number ${post.id} has been deleted` });
    });
});
// Write to database
function writeToDatabase(path, content) {
    fs_1.default.writeFile(path, JSON.stringify(content, null, 4), err => {
        if (err)
            return console.error(err);
    });
}
exports.default = app;
