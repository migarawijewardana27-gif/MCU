'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function GiphyReactionModal({ 
  isOpen, 
  onClose 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
}) {
  const [gifUrl, setGifUrl] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      const fetchGif = async () => {
        try {
          const apiKey = process.env.NEXT_PUBLIC_GIPHY_API_KEY;
          if (!apiKey) return;
          
          const offset = Math.floor(Math.random() * 50);
          const response = await fetch(
            `https://api.giphy.com/v1/gifs/search?api_key=${apiKey}&q=marvel+reaction&limit=1&offset=${offset}&rating=pg-13`
          );
          const data = await response.json();
          if (data?.data?.[0]?.images?.original?.url) {
            setGifUrl(data.data[0].images.original.url);
          }
        } catch (e) {
          console.error('Giphy fetch error:', e);
        }
      };

      fetchGif();
      const timer = setTimeout(onClose, 3500);
      return () => clearTimeout(timer);
    } else {
      setGifUrl(null);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && gifUrl && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 300 }}
            className="rounded-2xl overflow-hidden shadow-2xl border border-white/10"
            style={{ boxShadow: '0 0 60px rgba(236,29,36,0.3), 0 25px 50px rgba(0,0,0,0.5)' }}
          >
            <img 
              src={gifUrl} 
              alt="Marvel Reaction" 
              className="w-64 max-h-64 object-contain bg-black"
            />
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
