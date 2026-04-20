import { useState, useEffect } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/videos');
        
        // Recharts ke liye data format set kar rahe hain: [{name: 'Video 1', views: 10}]
        const chartData = res.data.map(video => ({
          name: video.title.length > 15 ? video.title.substring(0, 15) + '...' : video.title,
          views: video.views
        }));
        
        // Videos ko purane se naye ke order mein dikhane ke liye reverse kiya
        setData(chartData.reverse()); 
      } catch (error) {
        console.error("Analytics fetch error:", error);
      }
    };
    fetchAnalyticsData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Channel Analytics</h1>
      
      <div className="bg-white p-6 border rounded-lg shadow-sm mb-6">
        <h2 className="text-lg font-medium mb-6 text-gray-800">Views per Video</h2>
        
        <div className="h-96 w-full">
          {data.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                  dy={10}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#6B7280', fontSize: 12 }} 
                />
                <Tooltip 
                  cursor={{ fill: '#F3F4F6' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                />
                <Bar 
                  dataKey="views" 
                  fill="#8B5CF6" /* Mast Purple Color */
                  radius={[6, 6, 0, 0]} 
                  barSize={40} 
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500 font-medium">
              Data load ho raha hai ya channel par views 0 hain...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;