import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ThumbsUp, Share2 } from 'lucide-react';

const Watch = () => {
  const { id } = useParams();
  const [video, setVideo] = useState(null);
  const [suggestedVideos, setSuggestedVideos] = useState([]);
  const [subCount, setSubCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem('user'));
  const token = localStorage.getItem('token');

  useEffect(() => {
    window.scrollTo(0, 0); 
    const fetchData = async () => {
      setLoading(true);
      try {
        const vRes = await axios.get(`http://localhost:5000/api/videos/${id}`);
        setVideo(vRes.data);
        setLikes(vRes.data.likes?.length || 0);
        setIsLiked(vRes.data.likes?.includes(user?.id));

        const uRes = await axios.get(`http://localhost:5000/api/users/${vRes.data.userId}`);
        setSubCount(uRes.data.subscribers?.length || 0);
        setIsSubscribed(uRes.data.subscribers?.includes(user?.id));

        const cRes = await axios.get(`http://localhost:5000/api/comments/${id}`);
        setComments(cRes.data);

        const allRes = await axios.get(`http://localhost:5000/api/videos`);
        setSuggestedVideos(allRes.data.filter(v => v._id !== id));

        setLoading(false);
      } catch (e) { 
        console.error("Watch page error", e);
        setLoading(false); 
      }
    };
    fetchData();
  }, [id]);

  const handleLike = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/videos/${id}/like`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLikes(res.data.likesCount);
      setIsLiked(res.data.isLiked);
    } catch (e) { alert("Please login to like!"); }
  };

  const handleSubscribe = async () => {
    try {
      const res = await axios.post(`http://localhost:5000/api/users/subscribe/${video.userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSubCount(res.data.subCount);
      setIsSubscribed(res.data.isSubscribed);
    } catch (e) { alert("Please login to subscribe!"); }
  };

  const postComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const res = await axios.post('http://localhost:5000/api/comments', 
        { videoId: id, text: newComment, userName: user.name },
        { headers: { Authorization: `Bearer ${token}` }}
      );
      setComments([res.data, ...comments]);
      setNewComment('');
    } catch (e) { alert("Failed to post comment"); }
  };

  if (loading) return <div className="p-10 text-center font-bold text-xl animate-pulse">Loading Video... ⏳</div>;
  if (!video) return <div className="p-10 text-center font-bold text-red-500 text-2xl">Video Nahi Mili! ❌</div>;

  return (
    <div className="p-4 md:p-6 lg:p-8 max-w-[1400px] mx-auto flex flex-col lg:flex-row gap-6 bg-white min-h-screen">
      
      {/* LEFT SIDE: Main Player, Details & Comments */}
      <div className="flex-1 lg:max-w-[70%] xl:max-w-[75%]">
        <video src={video.videoUrl} controls autoPlay className="w-full aspect-video bg-black rounded-xl shadow-lg object-contain"></video>
        
        <div className="mt-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">{video.title}</h1>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mt-3 border-b pb-4 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-tr from-red-600 to-red-400 rounded-full text-white flex items-center justify-center font-bold uppercase shadow-sm">
                {video.title.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">Arsalan Studio</p>
                <p className="text-xs text-gray-500">{subCount} subscribers</p>
              </div>
              <button 
                onClick={handleSubscribe}
                className={`ml-3 px-5 py-2 rounded-full text-sm font-bold transition-all 
                ${isSubscribed ? 'bg-gray-200 text-gray-800' : 'bg-black text-white hover:bg-gray-800 shadow-md'}`}
              >
                {isSubscribed ? 'Subscribed' : 'Subscribe'}
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button onClick={handleLike} className={`flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 font-medium transition-colors hover:bg-gray-200 ${isLiked ? 'text-blue-600' : 'text-gray-800'}`}>
                <ThumbsUp size={18} fill={isLiked ? "currentColor" : "none"} /> {likes}
              </button>
              <button className="flex items-center gap-2 px-4 py-2 rounded-full bg-gray-100 font-medium text-gray-800 transition-colors hover:bg-gray-200">
                <Share2 size={18} /> Share
              </button>
            </div>
          </div>

          <div className="mt-4 bg-gray-100 hover:bg-gray-200 transition-colors cursor-pointer p-4 rounded-xl text-sm text-gray-800">
            <p className="font-bold mb-1">{video.views} views • {new Date(video.createdAt).toLocaleDateString()}</p>
            <p className="whitespace-pre-wrap">{video.description}</p>
          </div>
        </div>

        {/* COMMENTS SECTION */}
        <div className="mt-8 mb-10">
          <h3 className="font-bold text-lg mb-6">{comments.length} Comments</h3>
          <form onSubmit={postComment} className="flex gap-4 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold uppercase flex-shrink-0">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div className="flex-1 flex flex-col gap-2 justify-end">
              <input 
                value={newComment} 
                onChange={(e)=>setNewComment(e.target.value)} 
                placeholder="Add a comment..." 
                className="w-full border-b border-gray-300 focus:border-black outline-none pb-1 bg-transparent text-sm transition-colors" 
              />
              <div className="flex justify-end mt-1">
                <button type="submit" disabled={!newComment.trim()} className="bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-medium disabled:bg-gray-300 transition-colors">
                  Comment
                </button>
              </div>
            </div>
          </form>

          <div className="flex flex-col gap-6">
            {comments.map(c => (
              <div key={c._id} className="flex gap-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold uppercase text-gray-700 flex-shrink-0">
                  {c.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-bold text-gray-900">@{c.userName}</p>
                    <p className="text-xs text-gray-500">{new Date(c.createdAt).toLocaleDateString()}</p>
                  </div>
                  <p className="text-sm text-gray-800">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 🔥 RIGHT SIDE: Up Next / Suggested Videos 🔥 */}
      <div className="w-full lg:w-[30%] xl:w-[25%] flex flex-col gap-4">
        <h4 className="font-bold text-gray-900 mb-1">Up next</h4>
        <div className="flex flex-col gap-3">
          {suggestedVideos.map(vid => (
            <Link to={`/watch/${vid._id}`} key={vid._id} className="flex gap-2 group cursor-pointer">
              
              {/* NAYA THUMBNAIL BOX */}
              <div className="w-[160px] md:w-[180px] lg:w-[140px] xl:w-[168px] aspect-video bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 relative pointer-events-none">
                {vid.thumbnailUrl ? (
                  <img src={vid.thumbnailUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                ) : (
                  <video 
                    src={vid.videoUrl} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    muted 
                    preload="metadata"
                    onMouseOver={(e) => e.target.play()}
                    onMouseOut={(e) => { e.target.pause(); e.target.currentTime = 0; }}
                  />
                )}
              </div>
              
              <div className="flex flex-col pr-2">
                <h5 className="text-sm font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
                  {vid.title}
                </h5>
                <p className="text-xs text-gray-500 mt-1">Arsalan Studio</p>
                <p className="text-xs text-gray-500">{vid.views} views</p>
              </div>
            </Link>
          ))}
          {suggestedVideos.length === 0 && (
            <p className="text-sm text-gray-500 italic mt-4">Aur koi videos nahi hain...</p>
          )}
        </div>
      </div>

    </div>
  );
};

export default Watch;