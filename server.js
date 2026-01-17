const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// Public ෆෝල්ඩරයේ ඇති static ෆයිල් පෙන්වීමට
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection String
const mongoURI = "mongodb+srv://lohancperera_db_user:%23Lohan200122503384%23@cluster0.jy5zuqd.mongodb.net/edunetwork?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB connected..."))
    .catch(err => console.log("DB Connection Error:", err));

// User Schema
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// API Routes
app.post('/api/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ success: true, message: "Account created!" });
    } catch (error) {
        res.status(400).json({ success: false, error: "Email already exists!" });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email, password: req.body.password });
        if (user) {
            res.json({ success: true, message: "Welcome back!" });
        } else {
            res.status(401).json({ success: false, error: "Invalid credentials" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});

// Vercel සඳහා අවශ්‍යයි
module.exports = app;