const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// MongoDB Link with encoded password (# -> %23)
const mongoURI = "mongodb+srv://lohancperera_db_user:%23Lohan200122503384%23@cluster0.jy5zuqd.mongodb.net/edunetwork?retryWrites=true&w=majority";

mongoose.connect(mongoURI).then(() => console.log("DB Connected"));

const User = mongoose.model('User', new mongoose.Schema({ email: {type: String, unique: true}, password: {type: String} }));

app.post('/api/signup', async (req, res) => {
    try {
        await new User(req.body).save();
        res.json({ message: "Sign Up Successful!" });
    } catch (e) { res.status(400).json({ error: "Error: Email exists" }); }
});

app.post('/api/signin', async (req, res) => {
    const user = await User.findOne(req.body);
    if (user) res.json({ message: "Sign In Successful!" });
    else res.status(401).json({ error: "Invalid login" });
});

module.exports = app;