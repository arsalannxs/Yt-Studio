import { LayoutDashboard, Video, BarChart3, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/' },
    { icon: <Video size={20} />, label: 'Content', path: '/content' },
    { icon: <BarChart3 size={20} />, label: 'Analytics', path: '/analytics' },
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings' },
  ];

  return (
    <div className="h-screen w-64 border-r bg-white flex flex-col p-4 sticky top-0">
      <div className="flex items-center gap-2 mb-10 px-2">
        <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center text-white font-bold">S</div>
        <span className="text-xl font-bold">Studio</span>
      </div>
      
      <nav className="flex-1">
        {menuItems.map((item) => (
          <Link
            key={item.label}
            to={item.path}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 font-medium mb-1"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;