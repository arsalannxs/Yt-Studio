import { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const Home = () => {
  const [videos, setVideos] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  const categories = ['All', 'Music', 'Gaming', 'Coding', 'Vlogs', 'React', 'News'];

  useEffect(() => {
    const fetchVideos = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:5000/api/videos?category=${selectedCategory}`);
        setVideos(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };
    fetchVideos();
  }, [selectedCategory]); 

  return (
    <div className="p-4 md:p-6 bg-white min-h-screen">
      {/* 🏷️ CATEGORY PILLS */}
      <div className="flex gap-3 mb-8 overflow-x-auto pb-2 no-scrollbar sticky top-0 bg-white z-10 py-2">
        {categories.map((cat) => (
          <button 
            key={cat} 
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all border
              ${selectedCategory === cat 
                ? 'bg-black text-white border-black' 
                : 'bg-gray-100 text-gray-800 border-transparent hover:bg-gray-200'}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* 📺 VIDEO GRID */}
      {loading ? (
        <div className="text-center py-20 font-bold text-gray-500">Filtering videos... 🔍</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-10">
          {videos.map((video) => (
            <Link key={video._id} to={`/watch/${video._id}`} className="flex flex-col group">
              
              {/* 🔥 MAGIC FIX: HOVER TO PLAY THUMBNAIL */}
              <div className="aspect-video bg-gray-200 rounded-xl overflow-hidden mb-3 relative shadow-sm pointer-events-none">
                {video.thumbnailUrl ? (
                  <img src={video.thumbnailUrl} alt={video.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <video 
                    src={video.videoUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    muted 
                    preload="metadata"
                    onMouseOver={(e) => e.target.play()} 
                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                )}
                <div className="absolute bottom-2 right-2 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-medium">
                  Preview
                </div>
              </div>

              {/* Video Info */}
              <div className="flex gap-3 px-1">
                <div className="w-9 h-9 bg-red-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-sm uppercase">
                  {video.title.charAt(0)}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h3 className="text-[15px] font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600">
                    {video.title}
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">Arsalan Studio</p>
                  <p className="text-sm text-gray-500">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </Link>
          ))}
          {videos.length === 0 && (
            <div className="col-span-full text-center py-20 text-gray-500">
              Is category mein abhi koi video nahi hai bhai! 😅
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Home;