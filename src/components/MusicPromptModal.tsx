import React, { useState } from 'react';
import { Music, VolumeX, Sparkles, Headphones, Check } from 'lucide-react';
import { bgm, BGM_TRACKS, BgmTrackType } from '../utils/bgmEngine';
import { sound } from '../utils/audio';
import { MpiConfig } from '../types';

interface MusicPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenMusicSettings?: () => void;
  config?: MpiConfig;
  onChangeConfig?: (newConfig: MpiConfig) => void;
}

export const MusicPromptModal: React.FC<MusicPromptModalProps> = ({
  isOpen,
  onClose,
  onOpenMusicSettings,
  config,
  onChangeConfig
}) => {
  const [selectedTrack, setSelectedTrack] = useState<BgmTrackType>(
    config?.bgmTrack || 'lofi'
  );

  if (!isOpen) return null;

  const handleEnableMusic = () => {
    sound.playSuccess();
    bgm.setTrack(selectedTrack, selectedTrack === 'custom' ? config?.customAudioUrl : undefined);
    bgm.play();
    if (config && onChangeConfig) {
      onChangeConfig({
        ...config,
        bgmTrack: selectedTrack,
        bgmAutoPlay: true
      });
    }
    onClose();
  };

  const handleDisableMusic = () => {
    sound.playClick();
    bgm.stop();
    if (config && onChangeConfig) {
      onChangeConfig({
        ...config,
        bgmAutoPlay: false
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl border border-teal-200 animate-slide-up">
        
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 p-6 text-white text-center relative">
          <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
            🎧
          </div>
          <h3 className="font-black text-xl leading-tight">
            Ingin Belajar Ditemani Musik Latar?
          </h3>
          <p className="text-xs text-teal-100 mt-1 max-w-xs mx-auto">
            Musik pengiring instrumental santai dapat meningkatkan fokus dan antusiasme Anda saat menyelesaikan tantangan!
          </p>
        </div>

        <div className="p-6 space-y-4">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Pilih Suasana Musik Favorit:
            </span>

            <div className="grid grid-cols-2 gap-2">
              {BGM_TRACKS.map(t => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => {
                    sound.playClick();
                    setSelectedTrack(t.id);
                  }}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    selectedTrack === t.id
                      ? 'bg-teal-50 border-teal-500 text-teal-900 font-bold ring-2 ring-teal-400/30'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{t.icon}</span>
                    <div className="min-w-0">
                      <div className="text-xs font-bold truncate">{t.title}</div>
                      <div className="text-[10px] text-slate-400 truncate">{t.genre}</div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2.5 pt-2">
            <button
              type="button"
              id="btn-confirm-enable-music"
              onClick={handleEnableMusic}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-500 hover:to-emerald-500 text-white font-black text-sm shadow-md transition flex items-center justify-center gap-2"
            >
              <Music size={18} />
              <span>Ya, Aktifkan Musik Pengiring 🎶</span>
            </button>

            <button
              type="button"
              id="btn-confirm-disable-music"
              onClick={handleDisableMusic}
              className="w-full py-2.5 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-2"
            >
              <VolumeX size={16} />
              <span>Mode Hening / Tanpa Musik 🤫</span>
            </button>
          </div>

          <p className="text-[11px] text-slate-400 text-center leading-relaxed">
            Tenang, Anda bisa mengatur volume, mengganti lagu, atau mematikan musik sewaktu-waktu melalui ikon musik di bagian atas.
          </p>
        </div>

      </div>
    </div>
  );
};
