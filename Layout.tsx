
import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, onTabChange }) => {
  return (
    <div className="min-h-screen max-w-md mx-auto bg-[#e8e6e1] border-x border-[#cbc9c4] flex flex-col relative pb-32">
      {/* Header */}
      <header className="p-6 flex justify-between items-end border-b border-[#cbc9c4]/30">
        <div>
          <h1 className="text-xl font-bold lowercase tracking-tighter">blablalalarchive.</h1>
        </div>
        <nav className="flex gap-4 text-xs font-semibold uppercase tracking-widest opacity-60">
          <button 
            onClick={() => onTabChange('home')}
            className={activeTab === 'home' ? 'text-black opacity-100' : ''}
          >
            Index
          </button>
          <button 
            onClick={() => onTabChange('collection')}
            className={activeTab === 'collection' ? 'text-black opacity-100' : ''}
          >
            Gallery
          </button>
        </nav>
      </header>

      <main className="flex-1">
        {children}
      </main>

      {/* Floating Action Button Navigation */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/80 backdrop-blur-md px-6 py-3 rounded-full border border-[#cbc9c4] shadow-sm z-50">
        <button onClick={() => onTabChange('home')} className={`text-xs uppercase tracking-widest ${activeTab === 'home' ? 'font-bold' : 'opacity-40'}`}>Home</button>
        <span className="opacity-10 text-[10px]">|</span>
        <button onClick={() => onTabChange('collection')} className={`text-xs uppercase tracking-widest ${activeTab === 'collection' ? 'font-bold' : 'opacity-40'}`}>Cards</button>
        <span className="opacity-10 text-[10px]">|</span>
        <button onClick={() => onTabChange('playlist')} className={`text-xs uppercase tracking-widest ${activeTab === 'playlist' ? 'font-bold' : 'opacity-40'}`}>Music</button>
        <span className="opacity-10 text-[10px]">|</span>
        <button onClick={() => onTabChange('media')} className={`text-xs uppercase tracking-widest ${activeTab === 'media' ? 'font-bold' : 'opacity-40'}`}>Media</button>
      </div>
    </div>
  );
};

export default Layout;
