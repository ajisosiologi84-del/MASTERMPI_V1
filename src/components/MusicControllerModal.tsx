import React, { useState, useEffect, useRef } from 'react';
import { 
  Music, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Sparkles, 
  Sliders, 
  Upload, 
  Check, 
  Radio, 
  X,
  Headphones,
  FileAudio,
  Trash2,
  CheckCircle2
} from 'lucide-react';
import { bgm, BGM_TRACKS, BgmTrackType } from '../utils/bgmEngine';
import { sound } from '../utils/audio';
import { MpiConfig } from '../types';

interface MusicControllerModalProps {
  isOpen: boolean;
  onClose: () => void;
  config?: MpiConfig;
  onChangeConfig?: (newConfig: MpiConfig) => void;
}

export const MusicControllerModal: React.FC<MusicControllerModalProps> = ({
  isOpen,
  onClose,
  config,
  onChangeConfig
}) => {
  const [bgmStatus, setBgmStatus] = useState(bgm.getStatus());
  const [customFileName, setCustomFileName] = useState<string>(
    config?.customAudioName || (config?.customAudioUrl ? 'Musik Kustom Pengembang' : '')
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsub = bgm.subscribe(() => {
      setBgmStatus(bgm.getStatus());
    });
    return unsub;
  }, []);

  // Sync initial config to bgm engine if present
  useEffect(() => {
    if (config?.bgmTrack && config.bgmTrack !== bgm.getStatus().currentTrack) {
      bgm.setTrack(config.bgmTrack, config.customAudioUrl);
    }
    if (typeof config?.bgmVolume === 'number') {
      bgm.setVolume(config.bgmVolume);
    }
  }, [config?.bgmTrack, config?.customAudioUrl, config?.bgmVolume]);

  if (!isOpen) return null;

  const handleSelectTrack = (trackId: BgmTrackType) => {
    sound.playClick();
    bgm.setTrack(trackId, trackId === 'custom' ? config?.customAudioUrl : undefined);
    if (!bgmStatus.isPlaying) {
      bgm.play();
    }
    if (config && onChangeConfig) {
      onChangeConfig({
        ...config,
        bgmTrack: trackId
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert('Ukuran file audio terlalu besar (> 8MB). Silakan gunakan file MP3/WAV berdurasi singkat / ringkas agar file HTML tetap cepat dimuat.');
      return;
    }

    sound.playSuccess();
    setCustomFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const base64Audio = reader.result;
        bgm.setCustomAudio(base64Audio);
        if (!bgmStatus.isPlaying) {
          bgm.play();
        }
        if (config && onChangeConfig) {
          onChangeConfig({
            ...config,
            bgmTrack: 'custom',
            customAudioUrl: base64Audio,
            customAudioName: file.name
          });
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveCustomAudio = () => {
    sound.playClick();
    setCustomFileName('');
    handleSelectTrack('lofi');
    if (config && onChangeConfig) {
      onChangeConfig({
        ...config,
        bgmTrack: 'lofi',
        customAudioUrl: undefined,
        customAudioName: undefined
      });
    }
  };

  const handleVolumeChange = (vol: number) => {
    bgm.setVolume(vol);
    if (config && onChangeConfig) {
      onChangeConfig({
        ...config,
        bgmVolume: vol
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 animate-slide-up flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-600 via-emerald-600 to-indigo-600 p-5 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-xl shadow-inner">
              🎵
            </div>
            <div>
              <h3 className="font-black text-lg leading-tight">Pengaturan Musik Latar (BGM)</h3>
              <p className="text-xs text-teal-100">Musik pengiring agar belajar & bermain lebih fokus dan menyenangkan</p>
            </div>
          </div>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Master Playback Bar */}
        <div className="bg-slate-900 text-white p-4 border-b border-slate-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                sound.playClick();
                bgm.togglePlay();
              }}
              className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold shadow-md transition ${
                bgmStatus.isPlaying
                  ? 'bg-amber-400 text-slate-950 hover:bg-amber-300'
                  : 'bg-teal-500 text-white hover:bg-teal-400'
              }`}
            >
              {bgmStatus.isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-0.5" />}
            </button>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-200">
                  {bgmStatus.isPlaying ? 'Sedang Memutar Musik' : 'Musik Dijeda (Pause)'}
                </span>
                {bgmStatus.isPlaying && (
                  <span className="flex items-center gap-0.5">
                    <span className="w-1 h-3 bg-emerald-400 rounded-full animate-pulse" />
                    <span className="w-1 h-4 bg-teal-400 rounded-full animate-pulse delay-75" />
                    <span className="w-1 h-2 bg-indigo-400 rounded-full animate-pulse delay-150" />
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Track: {bgmStatus.currentTrack === 'custom' ? (customFileName || 'File Musik Kustom') : BGM_TRACKS.find(t => t.id === bgmStatus.currentTrack)?.title}
              </p>
            </div>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                sound.playClick();
                bgm.toggleMute();
              }}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
              title={bgmStatus.isMuted ? 'Batal Bisukan' : 'Bisukan Suara'}
            >
              {bgmStatus.isMuted || bgmStatus.volume === 0 ? (
                <VolumeX size={16} className="text-rose-400" />
              ) : (
                <Volume2 size={16} className="text-emerald-400" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={bgmStatus.isMuted ? 0 : bgmStatus.volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-teal-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
            />
          </div>
        </div>

        {/* Modal Body: Track Selection */}
        <div className="p-5 overflow-y-auto space-y-4">
          
          {/* Offline Sync Banner */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 flex items-start gap-2.5">
            <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-emerald-900 leading-snug">
              <span className="font-bold">100% Offline Embedded:</span> Musik yang Anda pilih atau unggah di sini akan <strong>otomatis tersimpan ke konfigurasi MPI</strong> dan <strong>tertanam langsung ke dalam file HTML hasil ekspor</strong>. Siswa dapat mendengarkannya tanpa koneksi internet!
            </div>
          </div>

          <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
            <Radio size={14} className="text-teal-600" />
            <span>Pilih Tema Musik Instrumen (100% Offline Synthesizer)</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {BGM_TRACKS.map((t) => {
              const isSelected = bgmStatus.currentTrack === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between relative ${
                    isSelected
                      ? 'bg-teal-50 border-teal-500 text-teal-950 shadow-sm ring-2 ring-teal-400/30'
                      : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{t.icon}</span>
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">{t.title}</div>
                        <div className="text-[10px] font-bold text-teal-700 uppercase tracking-wider">{t.genre}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <span className="w-5 h-5 rounded-full bg-teal-600 text-white flex items-center justify-center text-xs shadow-xs">
                        <Check size={12} strokeWidth={3} />
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {t.description}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Custom Upload Section */}
          <div className="pt-2 border-t border-slate-100">
            <div className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Upload size={14} className="text-teal-600" />
              <span>Atau Unggah Lagu Musik Sendiri (MP3 / WAV / OGG)</span>
            </div>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              accept="audio/*"
              className="hidden"
            />

            <div className="flex flex-col gap-2">
              <div className="flex flex-col sm:flex-row items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full sm:w-auto px-4 py-2.5 rounded-xl border-2 border-dashed border-teal-300 hover:border-teal-500 bg-teal-50/50 hover:bg-teal-50 text-teal-800 font-bold text-xs flex items-center justify-center gap-2 transition"
                >
                  <FileAudio size={16} />
                  <span>Pilih Berkas Audio dari Komputer/HP</span>
                </button>

                {customFileName && (
                  <div className="flex-1 flex items-center justify-between gap-2 px-3 py-2 bg-slate-100 rounded-xl border border-slate-200 text-xs">
                    <span className="truncate font-semibold text-slate-800">🎵 {customFileName}</span>
                    <button
                      type="button"
                      onClick={handleRemoveCustomAudio}
                      className="p-1 text-rose-500 hover:bg-rose-100 rounded-md transition"
                      title="Hapus Lagu Kustom & Kembali ke Synthesizer"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                )}
              </div>
              <p className="text-[11px] text-slate-400">
                Berkas audio akan diubah menjadi format data Base64 aman yang tersimpan di dalam berkas HTML tanpa butuh internet.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">
            Siswa dapat menyalakan/mematikan musik kapan saja melalui ikon di Header.
          </span>
          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-sm transition"
          >
            Simpan & Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
