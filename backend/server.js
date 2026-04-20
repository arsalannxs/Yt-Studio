const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Video = require('./models/Video');
const Comment = require('./models/Comment');
const { storage } = require('./config/cloudinary');

const app = express();
app.use(cors());
app.use(express.json());

// DB CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log("DB Connection Error:", err));

// AUTH MIDDLEWARE
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) return res.status(401).json({ message: "No token" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: "Invalid Token" });
  }
};

// --- AUTH ROUTES ---
app.post('/api/auth/signup', async (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashedPassword });
  await user.save();
  res.status(201).json({ message: "User created" });
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ message: "Invalid credentials" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, name: user.name, email: user.email } });
});

// --- VIDEO ROUTES ---
const upload = multer({ storage });
app.post('/api/videos/upload', verifyToken, upload.single('video'), async (req, res) => {
  const newVideo = new Video({
    title: req.body.title,
    description: req.body.description,
    videoUrl: req.file.path,
    userId: req.user.id
  });
  await newVideo.save();
  res.status(201).json(newVideo);
});

app.get('/api/videos', async (req, res) => {
  const videos = await Video.find().sort({ createdAt: -1 });
  res.json(videos);
});

app.get('/api/videos/search', async (req, res) => {
  const query = req.query.q;
  const videos = await Video.find({
    $or: [
      { title: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } }
    ]
  });
  res.json(videos);
});

app.get('/api/videos/:id', async (req, res) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).send("Not found");
    video.views += 1;
    await video.save();
    res.json(video);
  } catch (e) { res.status(500).send(e); }
});

// LIKE TOGGLE
app.post('/api/videos/:id/like', verifyToken, async (req, res) => {
  const video = await Video.findById(req.params.id);
  if (video.likes.includes(req.user.id)) {
    video.likes = video.likes.filter(id => id.toString() !== req.user.id);
  } else {
    video.likes.push(req.user.id);
  }
  await video.save();
  res.json({ likesCount: video.likes.length, isLiked: video.likes.includes(req.user.id) });
});

// --- COMMENT ROUTES ---
app.post('/api/comments', verifyToken, async (req, res) => {
  const comment = new Comment({ ...req.body, userId: req.user.id });
  await comment.save();
  res.status(201).json(comment);
});

app.get('/api/comments/:videoId', async (req, res) => {
  const comments = await Comment.find({ videoId: req.params.videoId }).sort({ createdAt: -1 });
  res.json(comments);
});

// 4. GET VIDEOS (With Category Filter)
app.get('/api/videos', async (req, res) => {
  try {
    const { category } = req.query;
    let filter = {};
    
    // Agar URL me ?category=Gaming hai, toh filter lagao
    if (category && category !== 'All') {
      filter = { 
        $or: [
          { title: { $regex: category, $options: 'i' } },
          { description: { $regex: category, $options: 'i' } }
        ]
      };
    }

    const videos = await Video.find(filter).sort({ createdAt: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: "Error fetching videos" });
  }
});

// 11. SUBSCRIBE/UNSUBSCRIBE TOGGLE
app.post('/api/users/subscribe/:channelId', verifyToken, async (req, res) => {
  try {
    const channelId = req.params.channelId;
    const userId = req.user.id;

    if (channelId === userId) return res.status(400).json({ message: "Bhai, khud ko subscribe nahi kar sakte!" });

    const channel = await User.findById(channelId);
    const currentUser = await User.findById(userId);

    if (channel.subscribers.includes(userId)) {
      // Unsubscribe logic
      channel.subscribers = channel.subscribers.filter(id => id.toString() !== userId);
      currentUser.subscriptions = currentUser.subscriptions.filter(id => id.toString() !== channelId);
    } else {
      // Subscribe logic
      channel.subscribers.push(userId);
      currentUser.subscriptions.push(channelId);
    }

    await channel.save();
    await currentUser.save();

    res.json({ 
      subCount: channel.subscribers.length, 
      isSubscribed: channel.subscribers.includes(userId) 
    });
  } catch (error) {
    res.status(500).json({ message: "Subscription failed" });
  }
});

app.listen(5000, () => console.log("Server 5000 pe chalu hai! 🚀"));