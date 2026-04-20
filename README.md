# 📺 Full-Stack YouTube Clone

A fully functional, responsive video-sharing platform built with the MERN stack. This application replicates core YouTube features, providing both viewer and creator experiences with seamless video streaming, social interactions, and content management.

## 🚀 Features

### Viewer Experience
* **Dynamic Home Feed:** Video grid with 'Hover to Play' video previews.
* **Category Filtering:** Filter videos seamlessly across categories (Music, Gaming, Coding, etc.).
* **Search Functionality:** Real-time search by video title or description.
* **Watch Page:** Interactive video player with dynamic "Up Next" suggestions.
* **Social Interactions:** Like/Unlike videos, post comments, and view comment history.
* **Subscription System:** Subscribe/Unsubscribe to channels with real-time count updates.

### Creator Studio (Dashboard)
* **Secure Auth:** JWT-based user authentication (Signup/Login/Logout).
* **Video Uploads:** Fast and reliable video uploading and storage using **Cloudinary** and Multer.
* **Content Management:** Dedicated dashboard to view, manage, and delete uploaded videos.
* **Channel Analytics:** Track total views, likes, and real-time subscriber counts.

## 🛠️ Tech Stack

* **Frontend:** React.js, Vite, Tailwind CSS, React Router DOM, Lucide Icons, Recharts (for analytics).
* **Backend:** Node.js, Express.js.
* **Database:** MongoDB, Mongoose.
* **Authentication:** JSON Web Tokens (JWT), Bcrypt.js.
* **Storage:** Cloudinary (for videos and thumbnails).

## 💻 Running the Project Locally

### Prerequisites
Make sure you have Node.js and MongoDB installed on your system. You will also need a Cloudinary account for video storage.

### 1. Clone the repository
```bash
git clone <your-github-repo-link>
cd youtube-clone