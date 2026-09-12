import React, { useState } from 'react';
import { MediaItem } from '../types';
import { 
  Image as ImageIcon, 
  FileText, 
  Table as TableIcon, 
  Eye, 
  Music, 
  Video, 
  Volume2, 
  Play, 
  Pause, 
  ExternalLink,
  Sparkles,
  Maximize2,
  X
} from 'lucide-react';
import { sound } from '../utils/audio';

interface MediaDisplayProps {
  mediaList?: MediaItem[];
  posisiFilter?: 'atas' | 'bawah' | 'semua';
}

export const MediaDisplay: React.FC<MediaDisplayProps> = ({ 
  mediaList, 
  posisiFilter = 'semua' 
}) => {
  const [playingAudioId, setPlayingAudioId] = useState<string | null>(null);
  const [activeLightboxImg, setActiveLightboxImg] = useState<{ url: string; title: string } | null>(null);

  if (!mediaList || mediaList.length === 0) return null;

  const filtered = mediaList.filter(item => {
    if (posisiFilter === 'semua') return true;
    const pos = item.posisi || 'atas';
    return pos === posisiFilter;
  });

  if (filtered.length === 0) return null;

  const toggleAudio = (id: string) => {
    const audioEl = document.getElementById(`audio-player-${id}`) as HTMLAudioElement;
    if (!audioEl) return;

    if (playingAudioId === id) {
      audioEl.pause();
      setPlayingAudioId(null);
    } else {
      // Pause any previously playing audio
      if (playingAudioId) {
        const prev = document.getElementById(`audio-player-${playingAudioId}`) as HTMLAudioElement;
        if (prev) prev.pause();
      }
      audioEl.play().catch(() => {});
      setPlayingAudioId(id);
    }
  };

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    if (url.includes('watch?v=')) {
      const id = url.split('watch?v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    if (url.includes('youtu.be/')) {
      const id = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${id}`;
    }
    return url;
  };

  return (
    <div className="space-y-4 my-4">
      {filtered.map((item) => {
        return (
          <div 
            key={item.id} 
            className="rounded-xl border border-slate-200 bg-white/90 shadow-xs overflow-hidden transition-all hover:shadow-sm"
          >
            {/* Header / Media Type Badge */}
            <div className="px-3.5 py-2 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-slate-700">
                {item.tipe === 'gambar' && <ImageIcon size={15} className="text-blue-600" />}
                {item.tipe === 'infografis' && <FileText size={15} className="text-emerald-600" />}
                {item.tipe === 'tabel' && <TableIcon size={15} className="text-indigo-600" />}
                {item.tipe === 'visual_lain' && <Eye size={15} className="text-amber-600" />}
                {item.tipe === 'musik' && <Music size={15} className="text-rose-600" />}
                {item.tipe === 'video' && <Video size={15} className="text-purple-600" />}
                <span className="capitalize">{item.tipe.replace('_', ' ')}:</span>
                <span className="text-slate-900 font-extrabold">{item.judul}</span>
              </div>

              {item.keterangan && (
                <span className="text-[11px] text-slate-500 italic max-w-xs truncate hidden sm:inline">
                  {item.keterangan}
                </span>
              )}
            </div>

            {/* Media Content Body */}
            <div className="p-3.5">
              
              {/* 1. GAMBAR & 4. GAMBAR VISUAL LAINNYA */}
              {(item.tipe === 'gambar' || item.tipe === 'visual_lain') && item.url && (
                <div className="space-y-2">
                  <div className="relative group max-h-80 overflow-hidden rounded-lg bg-slate-100 flex items-center justify-center border border-slate-200">
                    <img 
                      src={item.url} 
                      alt={item.judul}
                      className="w-full max-h-80 object-contain rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
                      loading="lazy"
                    />
                    <button
                      onClick={() => setActiveLightboxImg({ url: item.url!, title: item.judul })}
                      title="Perbesar Gambar"
                      className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-slate-900/80 text-white opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-xs shadow-md"
                    >
                      <Maximize2 size={13} />
                      <span>Perbesar</span>
                    </button>
                  </div>
                  {item.keterangan && (
                    <p className="text-xs text-slate-600 text-center italic">
                      {item.keterangan}
                    </p>
                  )}
                </div>
              )}

              {/* 2. INFOGRAFIS EDUKATIF */}
              {item.tipe === 'infografis' && item.url && (
                <div className="space-y-2">
                  <div className="relative group rounded-xl overflow-hidden bg-slate-950/5 p-2 border border-slate-200">
                    <img 
                      src={item.url} 
                      alt={item.judul}
                      className="w-full max-h-96 object-contain rounded-lg mx-auto shadow-sm"
                      loading="lazy"
                    />
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-600 px-1">
                      <span className="font-semibold text-emerald-800">📊 Infografis Telaah Konseptual</span>
                      <button
                        onClick={() => setActiveLightboxImg({ url: item.url!, title: item.judul })}
                        className="text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                      >
                        <Maximize2 size={12} /> Lihat Penuh
                      </button>
                    </div>
                  </div>
                  {item.keterangan && (
                    <div className="p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-900">
                      <strong>Keterangan Infografis:</strong> {item.keterangan}
                    </div>
                  )}
                </div>
              )}

              {/* 3. TABEL DATA EDUKATIF */}
              {item.tipe === 'tabel' && item.tabelData && (
                <div className="overflow-x-auto rounded-lg border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    {item.tabelData.headers && item.tabelData.headers.length > 0 && (
                      <thead className="bg-slate-100 text-slate-900 font-extrabold border-b border-slate-300">
                        <tr>
                          {item.tabelData.headers.map((h, hIdx) => (
                            <th key={hIdx} className="p-2.5 border-r border-slate-200 last:border-r-0">
                              {h}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody className="divide-y divide-slate-200">
                      {item.tabelData.rows.map((row, rIdx) => (
                        <tr key={rIdx} className={rIdx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70 hover:bg-blue-50/50'}>
                          {row.map((cell, cIdx) => (
                            <td key={cIdx} className="p-2.5 text-slate-800 border-r border-slate-200 last:border-r-0">
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {item.keterangan && (
                    <div className="p-2 bg-slate-50 text-[11px] text-slate-500 italic border-t border-slate-200">
                      Catatan Tabel: {item.keterangan}
                    </div>
                  )}
                </div>
              )}

              {/* 5. MUSIK / AUDIO PENJELASAN */}
              {item.tipe === 'musik' && item.url && (
                <div className="p-3 bg-gradient-to-r from-rose-50 to-indigo-50 rounded-xl border border-rose-200/80 flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => toggleAudio(item.id)}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white shadow-xs transition-all ${
                        playingAudioId === item.id 
                          ? 'bg-rose-600 scale-105 ring-4 ring-rose-300/60' 
                          : 'bg-rose-500 hover:bg-rose-600'
                      }`}
                      title={playingAudioId === item.id ? 'Jeda Audio' : 'Putar Audio'}
                    >
                      {playingAudioId === item.id ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>
                    <div>
                      <div className="text-xs font-black text-slate-900 flex items-center gap-1.5">
                        <Volume2 size={15} className="text-rose-600" />
                        <span>{item.judul}</span>
                      </div>
                      <div className="text-[11px] text-slate-600">
                        {item.keterangan || 'Audio narasi / stimulus suara pembelajaran'}
                      </div>
                    </div>
                  </div>

                  <audio 
                    id={`audio-player-${item.id}`} 
                    src={item.url} 
                    onEnded={() => setPlayingAudioId(null)}
                    controls 
                    className="w-full sm:w-60 h-8 text-xs"
                  />
                </div>
              )}

              {/* 6. LINK VIDEO / EMBED VIDEO */}
              {item.tipe === 'video' && item.url && (
                <div className="space-y-2">
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-black shadow-sm border border-slate-200">
                    {item.url.includes('youtube') || item.url.includes('youtu.be') ? (
                      <iframe
                        src={getYoutubeEmbedUrl(item.url)}
                        title={item.judul}
                        className="w-full h-full"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video 
                        src={item.url} 
                        controls 
                        className="w-full h-full object-contain"
                      >
                        Browser Anda tidak mendukung tag video.
                      </video>
                    )}
                  </div>
                  {item.keterangan && (
                    <p className="text-xs text-slate-600 italic text-center">
                      {item.keterangan}
                    </p>
                  )}
                </div>
              )}

            </div>
          </div>
        );
      })}

      {/* Lightbox Modal for Full View Image */}
      {activeLightboxImg && (
        <div 
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-xs animate-fade-in"
          onClick={() => setActiveLightboxImg(null)}
        >
          <div 
            className="relative max-w-4xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-2 border-b border-slate-200 mb-2">
              <span className="text-sm font-bold text-slate-800 truncate">{activeLightboxImg.title}</span>
              <button 
                onClick={() => setActiveLightboxImg(null)}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition"
              >
                <X size={18} />
              </button>
            </div>
            <img 
              src={activeLightboxImg.url} 
              alt={activeLightboxImg.title}
              className="max-h-[75vh] w-auto mx-auto object-contain rounded-lg" 
            />
          </div>
        </div>
      )}
    </div>
  );
};
