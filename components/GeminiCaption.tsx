
import React, { useState } from 'react';
import { GoogleGenAI } from "@google/genai";

interface GeminiCaptionProps {
  idolName: string;
}

const GeminiCaption: React.FC<GeminiCaptionProps> = ({ idolName }) => {
  const [loading, setLoading] = useState(false);
  const [caption, setCaption] = useState('');

  const generateCaption = async () => {
    setLoading(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Generate a short, cute, and aesthetic Instagram caption for a photocard of the idol ${idolName}. Include some relevant emojis. Keep it minimalist.`,
      });
      setCaption(response.text || 'No caption generated.');
    } catch (error) {
      console.error(error);
      setCaption('Error generating caption.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white/50 border border-black/10 p-4 rounded-lg mt-6">
      <h3 className="text-xs font-bold uppercase tracking-widest mb-2">AI Inspiration</h3>
      <p className="text-xs italic mb-4 opacity-70">"Need a caption for your new card?"</p>
      {caption && (
        <div className="bg-white p-3 border border-[#cbc9c4] text-sm mb-4 animate-in fade-in slide-in-from-bottom-2">
          {caption}
        </div>
      )}
      <button 
        onClick={generateCaption}
        disabled={loading}
        className="w-full py-2 bg-black text-white text-[10px] uppercase font-bold tracking-[0.2em] disabled:opacity-50"
      >
        {loading ? 'Thinking...' : 'Generate Caption'}
      </button>
    </div>
  );
};

export default GeminiCaption;
