const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// Public ෆෝල්ඩරය හරහා HTML/CSS පෙන්වීම
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection (Password encoded with %23 for #)
const mongoURI = "mongodb+srv://lohancperera_db_user:%23Lohan200122503384%23@cluster0.jy5zuqd.mongodb.net/edunetwork?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("Database Connection Error:", err));

// User Schema
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// API Routes
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        const newUser = new User({ email, password });
        await newUser.save();
        res.status(201).json({ success: true, message: "Sign Up Successful!" });
    } catch (error) {
        res.status(400).json({ success: false, error: "Email already exists!" });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: "Sign In Successful!" });
        } else {
            res.status(401).json({ success: false, error: "Invalid Credentials!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
});

// Vercel සඳහා අවශ්‍යයි
module.exports = app;