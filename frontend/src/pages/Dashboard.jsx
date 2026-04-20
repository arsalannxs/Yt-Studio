import { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Eye, PlaySquare, Clock } from 'lucide-react';
import { Link } from 'react-router-dom'; // <-- Ye add ho gaya

const Dashboard = () => {
  const [videos, setVideos] = useState([]);
  const [stats, setStats] = useState({ views: 0, totalVideos: 0 });

  useEffect(() => {
    // Backend se data laao aur stats calculate karo
    const fetchVideos = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos');
        const data = res.data;
        setVideos(data);
        
        // Total views calculate kar rahe hain (reduce array method se)
        const totalViews = data.reduce((acc, curr) => acc + curr.views, 0);
        setStats({ views: totalViews, totalVideos: data.length });
      } catch (error) {
        console.error("Dashboard data fetch error:", error);
      }
    };
    fetchVideos();
  }, []);

  // Backend automatically latest video sabse upar bhej raha hai (index 0)
  const latestVideo = videos[0]; 

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Channel Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Box 1: Latest Video Performance */}
        <div className="bg-white p-6 border rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Latest video performance</h2>
          
          {latestVideo ? (
            <>
              {/* VIDEO THUMBNAIL PAR LINK LAGA DIYA */}
              <Link 
                to={`/watch/${latestVideo._id}`} 
                className="aspect-video bg-gray-100 rounded mb-4 overflow-hidden relative block hover:opacity-90 transition-opacity cursor-pointer"
              >
                 {latestVideo.thumbnailUrl ? (
                    <img src={latestVideo.thumbnailUrl} className="w-full h-full object-cover" alt="thumbnail" />
                  ) : (
                    <video src={latestVideo.videoUrl} className="w-full h-full object-cover" />
                  )}
              </Link>
              
              {/* VIDEO KE TITLE PAR BHI LINK LAGA DIYA */}
              <Link to={`/watch/${latestVideo._id}`}>
                <h3 className="font-medium text-gray-900 truncate hover:text-blue-600 transition-colors cursor-pointer">
                  {latestVideo.title}
                </h3>
              </Link>
              
              <p className="text-xs text-gray-500 mb-4 truncate mt-1">{latestVideo.description}</p>
              
              <div className="flex justify-between text-sm text-gray-600 mt-4 border-b pb-2">
                <span>Views</span>
                <span className="font-medium text-black">{latestVideo.views}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2 border-b pb-2">
                <span>Status</span>
                <span className="text-green-600 font-medium">Public</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-2">
                <span>Upload Date</span>
                <span className="font-medium text-black">
                  {new Date(latestVideo.createdAt).toLocaleDateString()}
                </span>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <p>No videos uploaded yet.</p>
              <p className="text-sm">Click CREATE to upload your first video.</p>
            </div>
          )}
        </div>

        {/* Box 2: Channel Analytics Overview */}
        <div className="bg-white p-6 border rounded-lg shadow-sm col-span-2">
          <h2 className="text-lg font-medium mb-4 border-b pb-4">Channel analytics</h2>
          
          <div className="grid grid-cols-2 gap-8 mt-6">
            {/* Total Views */}
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <Eye size={20} />
                <span className="font-medium">Total Views</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.views}</p>
            </div>
            
            {/* Total Videos */}
            <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
              <div className="flex items-center gap-2 text-purple-700 mb-2">
                <PlaySquare size={20} />
                <span className="font-medium">Total Videos</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">{stats.totalVideos}</p>
            </div>

            {/* Subscribers */}
            <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="flex items-center gap-2 text-green-700 mb-2">
                <Users size={20} />
                <span className="font-medium">Subscribers</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">1,204</p>
            </div>

            {/* Watch Time */}
            <div className="p-4 bg-orange-50 border border-orange-100 rounded-lg">
              <div className="flex items-center gap-2 text-orange-700 mb-2">
                <Clock size={20} />
                <span className="font-medium">Watch Time (hrs)</span>
              </div>
              <p className="text-4xl font-bold text-gray-900">42.5</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;