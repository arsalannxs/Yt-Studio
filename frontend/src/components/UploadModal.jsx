import { X, Upload, Film, Image as ImageIcon } from 'lucide-react';
import { useState } from 'react';
import axios from 'axios';

const UploadModal = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [videoData, setVideoData] = useState({
    title: '',
    description: '',
    videoFile: null,
    thumbnail: null
  });

  const handlePublish = async () => {
    if (!videoData.title || !videoData.videoFile) {
      alert("Bhai, Title aur Video file zaroori hai!");
      return;
    }

    const formData = new FormData();
    formData.append('title', videoData.title);
    formData.append('description', videoData.description);
    formData.append('video', videoData.videoFile);

    const token = localStorage.getItem('token'); // Token nikalo

    try {
      console.log("Uploading start...");
      const res = await axios.post('http://localhost:5000/api/upload', formData, {
        headers: {
          Authorization: `Bearer ${token}` // Token bhejo
        }
      });
      alert("Kamaal kar diya! Video upload ho gayi.");
      
      // Reset karke band karo
      setStep(1);
      setVideoData({ title: '', description: '', videoFile: null, thumbnail: null });
      onClose(); 
      window.location.reload(); // Turant naya data dikhane ke liye page reload
    } catch (err) {
      console.error("Upload failed:", err);
      alert(err.response?.data?.message || "Upload fail ho gaya bro!");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">Upload video</h2>
          <button onClick={onClose} className="hover:bg-gray-100 p-1 rounded-full">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {step === 1 ? (
            <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-gray-300 rounded-lg">
              <div className="bg-gray-100 p-6 rounded-full mb-4 text-gray-500">
                <Upload size={48} />
              </div>
              <p className="text-lg">Drag and drop video files to upload</p>
              <label className="mt-6 bg-blue-600 text-white px-6 py-2 rounded font-medium cursor-pointer hover:bg-blue-700">
                SELECT FILES
                <input 
                  type="file" 
                  className="hidden" 
                  accept="video/*" 
                  onChange={(e) => {
                    setVideoData({...videoData, videoFile: e.target.files[0]});
                    setStep(2);
                  }}
                />
              </label>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title (required)</label>
                  <textarea 
                    className="w-full border rounded p-3 focus:ring-1 focus:ring-blue-500 outline-none"
                    rows="2"
                    value={videoData.title}
                    onChange={(e) => setVideoData({...videoData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea 
                    className="w-full border rounded p-3 focus:ring-1 focus:ring-blue-500 outline-none"
                    rows="5"
                    value={videoData.description}
                    onChange={(e) => setVideoData({...videoData, description: e.target.value})}
                  />
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded space-y-4">
                <div className="aspect-video bg-black rounded flex items-center justify-center text-white">
                  <Film size={40} />
                </div>
                <div className="text-xs text-gray-500">
                  <p>Filename</p>
                  <p className="text-gray-800 truncate">{videoData.videoFile?.name}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="p-4 border-t flex justify-end">
          {step === 2 && (
            <button 
              onClick={handlePublish}
              className="bg-blue-600 text-white px-6 py-2 rounded font-medium hover:bg-blue-700"
            >
              PUBLISH
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadModal;