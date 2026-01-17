const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads')); 

// Uploads ෆෝල්ඩරය නොමැති නම් එය සෑදීම
if (!fs.existsSync('./uploads')) {
    fs.mkdirSync('./uploads');
}

// ඔබේ MongoDB Link එක මෙතැනට දාන්න (දැනට මෙය local database එකකට සම්බන්ධයි)
mongoose.connect('mongodb+srv://lohancperera_db_user:#Lohan200122503384#@cluster0.jy5zuqd.mongodb.net/?appName=Cluster0', { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
}).then(() => console.log("Database Connected!"))
  .catch(err => console.error("Connection Error:", err));

// පෝස්ට් එකක ආකෘතිය
const Post = mongoose.model('Post', {
    user: String,
    content: String,
    image: String,
    date: { type: Date, default: Date.now }
});

// පින්තූර අප්ලෝඩ් කිරීමේ සැකසුම්
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage: storage });

// --- API පද්ධතිය ---

// පෝස්ට් එකක් දැමීම
app.post('/api/posts', upload.single('image'), async (req, res) => {
    try {
        const newPost = new Post({
            user: req.body.user || "Anonymous User",
            content: req.body.content,
            image: req.file ? req.file.filename : null
        });
        await newPost.save();
        res.json(newPost);
    } catch (err) { res.status(500).send(err); }
});

// සියලුම පෝස්ට් ලබාගැනීම
app.get('/api/posts', async (req, res) => {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
});

// සෙවුම් පද්ධතිය (Search)
app.get('/api/search', async (req, res) => {
    const query = req.query.q;
    const results = await Post.find({ content: new RegExp(query, 'i') });
    res.json(results);
});

// Real-time Chat එක
io.on('connection', (socket) => {
    socket.on('send_message', (data) => {
        io.emit('receive_message', data);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server is running on port ${PORT}`));