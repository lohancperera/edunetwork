const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
app.use(express.json());

// HTML/CSS තියෙන 'public' ෆෝල්ඩරය පෙන්වීම
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection String (Password: #Lohan200122503384# -> %23Lohan200122503384%23)
const mongoURI = "mongodb+srv://lohancperera_db_user:%23Lohan200122503384%23@cluster0.jy5zuqd.mongodb.net/edunetwork?retryWrites=true&w=majority";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("DB Connection Error: ", err));

// User Schema
const User = mongoose.model('User', new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
}));

// Sign Up Route
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

// Sign In Route
app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: "Sign In Successful!" });
        } else {
            res.status(401).json({ success: false, error: "Invalid email or password!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Server error" });
    }
});


module.exports = app;
