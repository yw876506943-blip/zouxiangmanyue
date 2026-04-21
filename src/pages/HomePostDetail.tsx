import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Heart, Share2, MessageSquare } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

export function HomePostDetail({ posts }: { posts: any[] }) {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const post = posts.find(p => p.id.toString() === id);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Return to previous page or home
  const handleBack = () => {
    navigate(-1);
  };

  if (!post) {
      return (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center text-white">
            <p>作品不存在</p>
            <button onClick={handleBack} className="mt-4 px-4 py-2 bg-white/20 rounded-full">返回</button>
        </div>
      );
  }

  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex(prev => prev + 1);
    }
  };

  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (currentImageIndex > 0) {
      setCurrentImageIndex(prev => prev - 1);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex flex-col items-center justify-center"
      >
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 p-4 flex items-center justify-between z-10 bg-gradient-to-b from-black/60 to-transparent">
          <div className="text-white font-medium text-sm">
            {currentImageIndex + 1} / {post.images.length}
          </div>
          <motion.button 
            className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center text-white backdrop-blur-md"
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
          >
            <X size={20} />
          </motion.button>
        </div>

        {/* Image Slider */}
        <div className="w-full max-w-lg aspect-[3/4] relative flex items-center justify-center" onClick={handleBack}>
          <img 
            src={post.images[currentImageIndex]} 
            className="max-w-full max-h-full object-contain"
            alt={post.title}
          />
          
          {/* Navigation Controls */}
          {currentImageIndex > 0 && (
            <button 
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          
          {currentImageIndex < post.images.length - 1 && (
            <button 
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/20 hover:bg-black/40 rounded-full flex items-center justify-center text-white backdrop-blur-md transition-colors"
            >
              <ChevronRight size={24} />
            </button>
          )}
        </div>

        {/* Bottom Info */}
        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
          <div className="max-w-lg mx-auto">
            <h3 className="text-white text-lg font-bold">{post.title}</h3>
            {post.category && (
              <span className="inline-block mt-2 px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[10px] text-white">
                {post.category}
              </span>
            )}
            
            {/* Actions */}
            <div className="flex items-center space-x-6 mt-4">
              <button className="flex items-center space-x-1.5 text-white/80 hover:text-white transition-colors">
                <Heart size={20} />
                <span className="text-sm font-medium">{post.likes}</span>
              </button>
              <button className="flex items-center space-x-1.5 text-white/80 hover:text-white transition-colors">
                <MessageSquare size={20} />
                <span className="text-sm font-medium">{post.comments || 0}</span>
              </button>
              <button className="flex items-center space-x-1.5 text-white/80 hover:text-white transition-colors">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
