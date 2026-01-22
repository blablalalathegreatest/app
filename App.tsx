import React, { useState, useRef, useEffect } from 'react';
import Layout from './components/Layout';
import PhotocardGrid from './components/PhotocardGrid';
import GeminiCaption from './components/GeminiCaption';
import { INITIAL_PHOTOCARDS, INITIAL_PLAYLISTS, Doodles, MEDIA_LINKS } from './constants';
import { IdolCategory, PlaylistLink, Photocard } from './types';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [selectedCategory, setSelectedCategory] = useState<IdolCategory | 'All'>('All');
  const [selectedMusicCategory, setSelectedMusicCategory] = useState<IdolCategory | 'All'>('All');
  
  // 初始化時嘗試從 localStorage 讀取資料，若無則使用初始值
  const [playlists, setPlaylists] = useState<PlaylistLink[]>(() => {
    const saved = localStorage.getItem('blarchive_playlists');
    return saved ? JSON.parse(saved) : INITIAL_PLAYLISTS;
  });
  
  const [photocards, setPhotocards] = useState<Photocard[]>(() => {
    const saved = localStorage.getItem('blarchive_photocards');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOCARDS;
  });

  const [isAddingPlaylist, setIsAddingPlaylist] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isCollectionEditMode, setIsCollectionEditMode] = useState(false);
  const [newPlaylist, setNewPlaylist] = useState({ name: '', url: '', category: 'Riize' as IdolCategory });
  const [showAddMenu, setShowAddMenu] = useState(false);

  // 當資料變動時，自動同步到 localStorage
  useEffect(() => {
    localStorage.setItem('blarchive_playlists', JSON.stringify(playlists));
  }, [playlists]);

  useEffect(() => {
    localStorage.setItem('blarchive_photocards', JSON.stringify(photocards));
  }, [photocards]);

  // Camera States
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleAddPlaylist = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylist.name && newPlaylist.url) {
      setPlaylists([...playlists, { ...newPlaylist, platform: 'YouTube' } as PlaylistLink]);
      setNewPlaylist({ name: '', url: '', category: 'Riize' });
      setIsAddingPlaylist(false);
    }
  };

  const deletePlaylist = (globalIndex: number) => {
    const updated = [...playlists];
    updated.splice(globalIndex, 1);
    setPlaylists(updated);
  };

  const movePlaylist = (globalIndex: number, direction: 'up' | 'down') => {
    const updated = [...playlists];
    const targetIndex = direction === 'up' ? globalIndex - 1 : globalIndex + 1;
    
    if (targetIndex >= 0 && targetIndex < updated.length) {
      [updated[globalIndex], updated[targetIndex]] = [updated[targetIndex], updated[globalIndex]];
      setPlaylists(updated);
    }
  };

  const handleUpdateCard = (cardId: string, updatedTags: string[]) => {
    setPhotocards(prev => prev.map(card => 
      card.id === cardId ? { ...card, tags: updatedTags } : card
    ));
  };

  const handleDeleteCard = (cardId: string) => {
    if (window.confirm('Delete this card from your collection?')) {
      setPhotocards(prev => prev.filter(card => card.id !== cardId));
    }
  };

  const startCamera = async () => {
    setShowAddMenu(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: false 
      });
      setCameraStream(stream);
      setIsCameraOpen(true);
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 100);
    } catch (err) {
      console.error("Camera error:", err);
      alert("Could not access camera. Please check permissions.");
    }
  };

  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraOpen(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL('image/jpeg', 0.8); // 稍微壓縮以節省空間
        
        const newCard: Photocard = {
          id: Date.now().toString(),
          url: imageUrl,
          title: 'New Capture',
          category: selectedCategory === 'All' ? 'Riize' : selectedCategory,
          dateAdded: new Date().toISOString().split('T')[0],
          tags: []
        };
        
        setPhotocards([newCard, ...photocards]);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const newCard: Photocard = {
          id: Date.now().toString(),
          url: reader.result as string,
          title: file.name.split('.')[0],
          category: selectedCategory === 'All' ? 'Riize' : selectedCategory,
          dateAdded: new Date().toISOString().split('T')[0],
          tags: []
        };
        setPhotocards([newCard, ...photocards]);
        setShowAddMenu(false);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    return () => {
      if (cameraStream) {
        cameraStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraStream]);

  const renderHome = () => (
    <div className="pb-24">
      <div className="relative w-full aspect-[4/5] overflow-hidden group border-b border-[#cbc9c4]/30">
        <img 
          src="https://i.pinimg.com/1200x/78/36/8d/78368d2dc1e0667f3c041d261a4f9bb3.jpg" 
          alt="Hero Background" 
          className="w-full h-full object-cover grayscale-[0.1] group-hover:grayscale-0 transition-all duration-1000"
        />
        <div className="absolute inset-0 flex flex-col justify-center p-8 z-10 bg-black/20">
          <div className="absolute top-8 right-8 text-white">
            <Doodles.Flower />
          </div>
          <h2 className="text-6xl font-hiragino font-bold tracking-tighter leading-[1.3] text-white drop-shadow-lg">
            金道英 <br />
            <span className="pl-4">快回來</span>
          </h2>
          <div className="mt-6 max-w-[40px] opacity-80 text-white">
            <Doodles.Wavy />
          </div>
        </div>
        <div className="absolute bottom-6 right-6 opacity-30 text-white">
          <Doodles.Star />
        </div>
      </div>

      <div className="p-8 space-y-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <p className="text-[10px] uppercase tracking-[0.4em] font-bold opacity-30">Selection</p>
            <p className="text-sm leading-relaxed opacity-80 max-w-[90%] font-medium">
              Your personal sanctuary for <strong>Riize</strong>, <strong>NCT 127</strong>, and <strong>XngHan</strong>.
            </p>
          </div>
          <div className="flex flex-col gap-1 mt-6">
            <button onClick={() => { setSelectedCategory('Riize'); setActiveTab('collection'); }} className="text-left py-5 border-b border-black/10 flex justify-between items-center group hover:bg-white/40 px-2 transition-colors">
              <span className="text-2xl font-bold tracking-tighter">01. Riize</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">→</span>
            </button>
            <button onClick={() => { setSelectedCategory('NCT127'); setActiveTab('collection'); }} className="text-left py-5 border-b border-black/10 flex justify-between items-center group hover:bg-white/40 px-2 transition-colors">
              <span className="text-2xl font-bold tracking-tighter">02. NCT 127</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">→</span>
            </button>
            <button onClick={() => { setSelectedCategory('XngHan'); setActiveTab('collection'); }} className="text-left py-5 border-b border-black/10 flex justify-between items-center group hover:bg-white/40 px-2 transition-colors">
              <span className="text-2xl font-bold tracking-tighter">03. XngHan</span>
              <span className="opacity-0 group-hover:opacity-100 transition-all transform translate-x-[-10px] group-hover:translate-x-0">→</span>
            </button>
          </div>
        </div>
        <div className="pt-12 flex justify-center opacity-10">
          <Doodles.Wavy />
        </div>
      </div>
    </div>
  );

  const renderCollection = () => (
    <div className="py-6 pb-32">
      <div className="px-6 mb-8 flex justify-between items-start">
        <div>
          <h2 className="text-3xl font-bold tracking-tighter mb-4">Gallery</h2>
          <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {['All', 'Riize', 'NCT127', 'XngHan'].map((cat) => (
              <button key={cat} onClick={() => setSelectedCategory(cat as any)} className={`text-[10px] uppercase font-bold tracking-widest px-4 py-1 border border-black transition-colors ${selectedCategory === cat ? 'bg-black text-white' : 'bg-transparent text-black'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        <button 
          onClick={() => setIsCollectionEditMode(!isCollectionEditMode)}
          className={`p-2 transition-colors duration-300 rounded-full mt-1 ${isCollectionEditMode ? 'bg-black text-white' : 'opacity-30 hover:opacity-100'}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            {isCollectionEditMode ? (
              <path d="M20 6L9 17l-5-5" />
            ) : (
              <>
                <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
              </>
            )}
          </svg>
        </button>
      </div>
      
      {isCameraOpen && (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col animate-in fade-in duration-300">
          <div className="flex-1 relative flex items-center justify-center overflow-hidden">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-8 border border-white/30 pointer-events-none flex items-center justify-center">
              <div className="w-4 h-4 border-t border-l border-white/60 absolute top-0 left-0"></div>
              <div className="w-4 h-4 border-t border-r border-white/60 absolute top-0 right-0"></div>
              <div className="w-4 h-4 border-b border-l border-white/60 absolute bottom-0 left-0"></div>
              <div className="w-4 h-4 border-b border-r border-white/60 absolute bottom-0 right-0"></div>
            </div>
          </div>
          <div className="p-8 flex justify-between items-center bg-black">
            <button 
              onClick={stopCamera} 
              className="text-[10px] uppercase font-bold tracking-widest text-white/60 px-4 py-2 border border-white/20"
            >
              Cancel
            </button>
            <button 
              onClick={capturePhoto} 
              className="w-16 h-16 rounded-full border-4 border-white flex items-center justify-center group active:scale-95 transition-transform"
            >
              <div className="w-12 h-12 bg-white rounded-full"></div>
            </button>
            <div className="w-[60px]"></div>
          </div>
          <canvas ref={canvasRef} className="hidden" />
        </div>
      )}

      <PhotocardGrid 
        cards={photocards} 
        selectedCategory={selectedCategory} 
        isEditMode={isCollectionEditMode}
        onUpdateCard={handleUpdateCard}
        onDeleteCard={handleDeleteCard}
      />

      <div className="mt-12 px-6">
        {selectedCategory !== 'All' && <GeminiCaption idolName={selectedCategory} />}
        
        <div className="border border-[#cbc9c4] p-6 text-center space-y-4 bg-white/30 relative mt-8">
           <p className="text-xs uppercase tracking-[0.3em] font-semibold opacity-50">Add Content</p>
           
           {!showAddMenu ? (
             <button 
               onClick={() => setShowAddMenu(true)}
               className="block w-full py-8 border-2 border-dashed border-[#cbc9c4] cursor-pointer hover:bg-black hover:text-white transition-all group"
             >
                <span className="text-2xl opacity-40 group-hover:opacity-100">+</span>
                <p className="text-[10px] uppercase tracking-widest font-bold mt-2 opacity-40 group-hover:opacity-100">Upload</p>
             </button>
           ) : (
             <div className="grid grid-cols-2 gap-4 animate-in fade-in zoom-in duration-200">
                <input 
                  type="file" 
                  className="hidden" 
                  id="card-upload-file" 
                  ref={fileInputRef}
                  onChange={handleFileUpload} 
                  accept="image/*" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="block w-full py-6 border border-black cursor-pointer bg-black text-white hover:opacity-80 transition-all"
                >
                    <span className="text-lg">🖼</span>
                    <p className="text-[8px] uppercase tracking-widest font-bold mt-1">Photo Library</p>
                </button>
                <button 
                  onClick={startCamera} 
                  className="block w-full py-6 border border-black cursor-pointer bg-black text-white hover:opacity-80 transition-all"
                >
                    <span className="text-lg">📷</span>
                    <p className="text-[8px] uppercase tracking-widest font-bold mt-1">Take Photo</p>
                </button>
                <button 
                  onClick={() => setShowAddMenu(false)}
                  className="col-span-2 text-[8px] uppercase tracking-[0.2em] font-bold opacity-40 hover:opacity-100 py-2"
                >
                  Cancel
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );

  const renderPlaylist = () => {
    const playlistsWithIndices = playlists.map((pl, idx) => ({ ...pl, globalIndex: idx }));
    const filtered = selectedMusicCategory === 'All' 
      ? playlistsWithIndices 
      : playlistsWithIndices.filter(p => p.category === selectedMusicCategory);

    return (
      <div className="p-8 space-y-8 pb-32">
        <div className="flex justify-between items-center">
          <h2 className="text-4xl font-bold tracking-tighter">My Sounds</h2>
          <button 
            onClick={() => setIsEditMode(!isEditMode)}
            className={`p-2 transition-colors duration-300 rounded-full ${isEditMode ? 'bg-black text-white' : 'opacity-30 hover:opacity-100'}`}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {isEditMode ? (
                <path d="M20 6L9 17l-5-5" />
              ) : (
                <>
                  <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
                  <path d="M18.5 2.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 9.5-9.5z" />
                </>
              )}
            </svg>
          </button>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {['All', 'Riize', 'NCT127', 'XngHan'].map((cat) => (
            <button key={cat} onClick={() => setSelectedMusicCategory(cat as any)} className={`text-[10px] uppercase font-bold tracking-widest px-4 py-1 border border-black transition-colors ${selectedMusicCategory === cat ? 'bg-black text-white' : 'bg-transparent text-black'}`}>
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          {filtered.map((pl) => (
            <div key={pl.globalIndex} className="group relative">
              {isEditMode && (
                <div className="absolute -top-3 right-0 flex gap-1 z-10 animate-in fade-in zoom-in duration-200">
                  <div className="flex bg-white border border-[#cbc9c4] shadow-sm rounded-sm overflow-hidden">
                    <button 
                      onClick={() => movePlaylist(pl.globalIndex, 'up')}
                      disabled={pl.globalIndex === 0}
                      className="w-7 h-7 flex items-center justify-center text-[10px] hover:bg-black hover:text-white disabled:opacity-10 transition-colors"
                    >
                      ↑
                    </button>
                    <button 
                      onClick={() => movePlaylist(pl.globalIndex, 'down')}
                      disabled={pl.globalIndex === playlists.length - 1}
                      className="w-7 h-7 flex items-center justify-center text-[10px] hover:bg-black hover:text-white disabled:opacity-10 transition-colors border-x border-[#cbc9c4]"
                    >
                      ↓
                    </button>
                    <button 
                      onClick={() => deletePlaylist(pl.globalIndex)}
                      className="w-7 h-7 flex items-center justify-center text-[12px] text-red-400 hover:bg-red-500 hover:text-white transition-colors"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <a 
                href={isEditMode ? undefined : pl.url} 
                target="_blank" 
                rel="noopener noreferrer" 
                className={`block p-6 bg-white border border-[#cbc9c4] transition-all duration-300 ${isEditMode ? 'opacity-60 grayscale-[0.5] scale-[0.98]' : 'hover:border-black cursor-pointer'}`}
                onClick={(e) => isEditMode && e.preventDefault()}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-40">YouTube Music</span>
                    <span className="text-[9px] uppercase tracking-widest text-black/40 font-bold">{pl.category}</span>
                  </div>
                  {!isEditMode && <span className="group-hover:translate-x-1 transition-transform opacity-30 group-hover:opacity-100">↗</span>}
                </div>
                <h3 className="text-xl font-bold">{pl.name}</h3>
              </a>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="py-20 text-center opacity-30 italic text-sm border border-dashed border-[#cbc9c4]">No playlists added for this category.</div>
          )}
        </div>

        <div className="mt-12">
          {isAddingPlaylist ? (
            <form onSubmit={handleAddPlaylist} className="p-6 bg-white border border-[#cbc9c4] space-y-4 animate-in fade-in slide-in-from-bottom-2">
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Playlist Name</label>
                <input type="text" value={newPlaylist.name} onChange={(e) => setNewPlaylist({ ...newPlaylist, name: e.target.value })} className="w-full bg-[#f8f7f5] border border-[#cbc9c4] px-4 py-2 text-sm focus:outline-none focus:border-black" placeholder="e.g. My Favorite Tracks" required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">YT Music URL</label>
                <input type="url" value={newPlaylist.url} onChange={(e) => setNewPlaylist({ ...newPlaylist, url: e.target.value })} className="w-full bg-[#f8f7f5] border border-[#cbc9c4] px-4 py-2 text-sm focus:outline-none focus:border-black" placeholder="https://music.youtube.com/..." required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-widest font-bold opacity-40">Category</label>
                <select value={newPlaylist.category} onChange={(e) => setNewPlaylist({ ...newPlaylist, category: e.target.value as IdolCategory })} className="w-full bg-[#f8f7f5] border border-[#cbc9c4] px-4 py-2 text-sm focus:outline-none focus:border-black appearance-none">
                  <option value="Riize">Riize</option>
                  <option value="NCT127">NCT 127</option>
                  <option value="XngHan">XngHan</option>
                </select>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="submit" className="flex-1 py-3 bg-black text-white text-[10px] uppercase font-bold tracking-widest hover:opacity-80 transition-opacity">Save Playlist</button>
                <button type="button" onClick={() => setIsAddingPlaylist(false)} className="px-6 py-3 border border-[#cbc9c4] text-[10px] uppercase font-bold tracking-widest hover:bg-black/5 transition-colors">Cancel</button>
              </div>
            </form>
          ) : (
            <button onClick={() => setIsAddingPlaylist(true)} className="w-full py-8 border-2 border-dashed border-[#cbc9c4] text-center hover:bg-white/40 transition-colors group">
              <span className="text-2xl opacity-20 group-hover:opacity-100 transition-opacity">+</span>
              <p className="text-[10px] uppercase tracking-widest font-bold opacity-30 mt-2">Add New List</p>
            </button>
          )}
        </div>

        <div className="pt-20 text-center">
          <Doodles.Flower />
          <p className="text-[10px] uppercase tracking-widest mt-4 opacity-40">end of stream</p>
        </div>
      </div>
    );
  };

  const renderMedia = () => (
    <div className="p-8 space-y-12 pb-32">
      <h2 className="text-4xl font-bold tracking-tighter">Media</h2>
      <div className="space-y-16">
        {(['Riize', 'NCT127', 'XngHan'] as IdolCategory[]).map((group) => (
          <div key={group} className="space-y-6">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold uppercase tracking-[0.4em] opacity-30">Section</span>
              <div className="h-[1px] flex-1 bg-black/10"></div>
              <h3 className="text-2xl font-bold tracking-tight">{group}</h3>
            </div>
            <div className="grid grid-cols-1 gap-4">
              <a href={MEDIA_LINKS[group].instagram} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-white border border-[#cbc9c4] hover:bg-black hover:text-white transition-all group">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100">Official</span>
                  <span className="text-lg font-bold">Instagram</span>
                </div>
                <span className="text-xl opacity-30 group-hover:opacity-100">@</span>
              </a>
              <a href={MEDIA_LINKS[group].youtube} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-6 bg-white border border-[#cbc9c4] hover:bg-black hover:text-white transition-all group">
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-widest font-bold opacity-60 group-hover:opacity-100">Official</span>
                  <span className="text-lg font-bold">YouTube</span>
                </div>
                <span className="text-xl opacity-30 group-hover:opacity-100">▶</span>
              </a>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-12 flex justify-center opacity-10">
        <Doodles.Star />
      </div>
    </div>
  );

  return (
    <Layout activeTab={activeTab} onTabChange={setActiveTab}>
      {activeTab === 'home' && renderHome()}
      {activeTab === 'collection' && renderCollection()}
      {activeTab === 'playlist' && renderPlaylist()}
      {activeTab === 'media' && renderMedia()}
    </Layout>
  );
};

export default App;
