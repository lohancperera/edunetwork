const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Middleware
app.use(bodyParser.json());
// HTML/CSS ෆයිල්ස් තියෙන 'public' ෆෝල්ඩරය හඳුන්වා දීම
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Connection String (Password encoded with %23 for #)
const mongoURI = "mongodb+srv://lohancperera_db_user:%23Lohan200122503384%23@cluster0.jy5zuqd.mongodb.net/edunetwork?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(mongoURI)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch(err => console.log("MongoDB Connection Error: ", err));

// User Schema (දත්ත ගබඩා වන ආකාරය)
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const User = mongoose.model('User', userSchema);

// Sign Up Route (අලුතින් එකවුන්ට් එකක් හැදීම)
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

// Sign In Route (ලොග් වීම පරීක්ෂා කිරීම)
app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email, password });
        if (user) {
            res.status(200).json({ success: true, message: "Sign In Successful!" });
        } else {
            res.status(401).json({ success: false, error: "Invalid Email or Password!" });
        }
    } catch (error) {
        res.status(500).json({ success: false, error: "Server Error!" });
    }
});

// Vercel සඳහා අවශ්‍ය Port සැකසුම
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

module.exports = app;