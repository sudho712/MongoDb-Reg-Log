const express = require("express");
const app = express();
const path = require("path");
const hbs = require("hbs");
const collection1 = require("./mongodb"); // Mongoose model for MongoDB

const templatePath = path.join(__dirname, "../templates");

// Middleware for JSON and URL-encoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Set up view engine and templates path
app.set("view engine", "hbs");
app.set("views", templatePath);

// Route for home/login page
app.get("/", (req, res) => {
    res.render("login");
});

// Route for signup page
app.get("/signup", (req, res) => {
    res.render("signup");
});

// Handle signup form submission
app.post("/signup", async (req, res) => {
    try {
        const data = {
            name: req.body.name,
            password: req.body.password,
        };
        await collection1.create(data); // Create a new user
        console.log("User registered:", data);
        res.render("home"); // Redirect to home page after signup
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).send("An error occurred during signup.");
    }
});

// Handle login form submission
app.post("/login", async (req, res) => {
    try {
        const { name, password } = req.body; // Get username and password from form
        const user = await collection1.findOne({ name, password }); // Check if user exists
        
        if (user) {
            console.log("User logged in:", user);
            res.render("home"); // Redirect to home page if login is successful
        } else {
            res.status(401).send("Invalid username or password."); // Handle invalid login
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).send("An error occurred during login.");
    }
});

// Start the server
app.listen(3000, () => {
    console.log("Server running on port 3000");
});
