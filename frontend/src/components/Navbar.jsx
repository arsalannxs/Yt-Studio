import { Search, Video as VideoIcon, Bell, LogOut } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadModal from './UploadModal';

const Navbar = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/auth');
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim() !== '') {
      navigate(`/search?q=${searchTerm}`);
    }
  };

  const handleLogout = () => {
    if (window.confirm("Logout karna hai bhai?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate('/auth');
    }
  };

  // Agar user load nahi hua hai toh blank return karo taaki crash na ho
  if (!user) return null;

  return (
    <>
      <div className="h-16 border-b bg-white flex items-center justify-between px-8 sticky top-0 z-10 shadow-sm">
        
        {/* Search Bar */}
        <div className="flex items-center bg-gray-100 px-4 py-1.5 rounded-full w-full max-w-lg border focus-within:border-blue-500 focus-within:bg-white transition-all">
          <Search size={18} className="text-gray-500" />
          <input 
            type="text" 
            placeholder="Search videos..." 
            className="bg-transparent border-none focus:outline-none ml-3 w-full text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>

        {/* Right Side Icons */}
        <div className="flex items-center gap-6">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-red-600 text-white px-4 py-1.5 rounded-full hover:bg-red-700 font-medium transition-colors shadow-sm"
          >
            <VideoIcon size={18} />
            <span className="hidden md:block">CREATE</span>
          </button>
          
          <Bell size={20} className="text-gray-600 cursor-pointer hover:text-black" />
          
          <div className="flex items-center gap-4 border-l pl-4">
            <div className="flex items-center gap-2 group cursor-pointer" title={user?.name || 'User'}>
              {/* 🔥 MAGIC FIX: Ye line ab crash nahi hogi chahe name undefined kyun na ho */}
              <div className="w-8 h-8 bg-gradient-to-tr from-purple-600 to-blue-500 rounded-full text-white flex items-center justify-center text-sm font-bold uppercase shadow-md">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <span className="text-sm font-semibold text-gray-700 hidden lg:block">
                {user?.name || 'User'}
              </span>
            </div>

            <button 
              onClick={handleLogout} 
              className="text-gray-400 hover:text-red-600 transition-colors"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>

      <UploadModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </>
  );
};

export default Navbar;