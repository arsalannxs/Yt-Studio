import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Edit, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const Content = () => {
  const [myVideos, setMyVideos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyVideos();
  }, []);

  const fetchMyVideos = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/videos');
      // Filter: Sirf wahi videos dikhao jo current user ki hain
      const user = JSON.parse(localStorage.getItem('user'));
      const filtered = res.data.filter(v => v.userId === user.id);
      setMyVideos(filtered);
      setLoading(false);
    } catch (error) {
      console.error("Fetch error:", error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bhai, pakka delete karni hai? Wapas nahi aayegi!")) {
      try {
        await axios.delete(`http://localhost:5000/api/videos/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        // List update karo
        setMyVideos(myVideos.filter(v => v._id !== id));
        alert("Video uda di gayi! 🗑️");
      } catch (error) {
        alert("Delete nahi ho payi, check console.");
      }
    }
  };

  if (loading) return <div className="p-8">Loading your content...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Channel Content</h1>
      
      <div className="bg-white border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-600">Video</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Date</th>
              <th className="p-4 text-sm font-semibold text-gray-600">Views</th>
              <th className="p-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {myVideos.map((video) => (
              <tr key={video._id} className="border-b hover:bg-gray-50 transition-colors">
                <td className="p-4 flex gap-4 items-center">
                  <div className="w-24 aspect-video bg-gray-200 rounded overflow-hidden flex-shrink-0">
                    <img src={video.thumbnailUrl || video.videoUrl} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{video.title}</p>
                    <p className="text-xs text-gray-500 line-clamp-1">{video.description}</p>
                  </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {new Date(video.createdAt).toLocaleDateString()}
                </td>
                <td className="p-4 text-sm text-gray-600">{video.views}</td>
                <td className="p-4 text-right">
                  <div className="flex justify-end gap-3">
                    <Link to={`/watch/${video._id}`} className="p-2 hover:bg-blue-50 text-blue-600 rounded">
                      <ExternalLink size={18} />
                    </Link>
                    <button className="p-2 hover:bg-gray-100 text-gray-600 rounded">
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(video._id)}
                      className="p-2 hover:bg-red-50 text-red-600 rounded"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {myVideos.length === 0 && (
          <div className="p-20 text-center text-gray-500">
            Abhi tak koi video upload nahi ki hai bhai!
          </div>
        )}
      </div>
    </div>
  );
};

export default Content;