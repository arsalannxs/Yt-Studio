import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Content from './pages/Content';
import Auth from './pages/Auth';
import Watch from './pages/Watch';
import Analytics from './pages/Analytics';
import Search from './pages/Search'; // <-- NAYA IMPORT

function App() {
  return (
    <Router>
      <div className="flex bg-gray-50 min-h-screen">
        <Sidebar />
        <div className="flex-1 h-screen overflow-y-auto">
          <Navbar />
          <main>
            <Routes>
              {/* Login/Signup */}
              <Route path="/auth" element={<Auth />} /> 
              
              {/* Viewer Pages */}
              <Route path="/" element={<Home />} /> 
              <Route path="/watch/:id" element={<Watch />} />
              <Route path="/search" element={<Search />} />
              
              {/* Creator Pages */}
              <Route path="/dashboard" element={<Dashboard />} /> 
              <Route path="/content" element={<Content />} />
              <Route path="/analytics" element={<Analytics />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
}

export default App;