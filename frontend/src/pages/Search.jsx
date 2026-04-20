import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';

const Search = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q'); // URL se ?q=... nikalega
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    const fetchSearchResults = async () => {
      const res = await axios.get(`http://localhost:5000/api/videos/search?q=${query}`);
      setVideos(res.data);
    };
    if (query) fetchSearchResults();
  }, [query]);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-lg mb-6 text-gray-600">Search results for: <span className="font-bold text-black">"{query}"</span></h2>
      
      <div className="flex flex-col gap-4">
        {videos.map(video => (
          <Link key={video._id} to={`/watch/${video._id}`} className="flex flex-col md:flex-row gap-4 group">
            <div className="w-full md:w-72 aspect-video bg-gray-200 rounded-xl overflow-hidden flex-shrink-0">
               <img src={video.thumbnailUrl || video.videoUrl} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold group-hover:text-blue-600">{video.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600 mt-3 line-clamp-2">{video.description}</p>
            </div>
          </Link>
        ))}
        {videos.length === 0 && <p className="text-center py-20 text-gray-500">Bhai, kuch nahi mila! Doosra try kar.</p>}
      </div>
    </div>
  );
};

export default Search;