import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Download, BookOpen, Gamepad2, FileCheck2, Sparkles, ArrowLeft, Lock, Music, Headphones, Play, Pause } from 'lucide-react';
import { CONFIG } from '../data/mpiData';
import { MpiConfig } from '../types';
import { sound } from '../utils/audio';
import { bgm, BGM_TRACKS } from '../utils/bgmEngine';

interface NavbarProps {
  activeTab: 'materi' | 'bermain' | 'berlatih';
  setActiveTab: (tab: 'materi' | 'bermain' | 'berlatih') => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  onOpenExport: () => void;
  config?: MpiConfig;
  totalMateri?: number;
  totalGames?: number;
  totalSoal?: number;
  onBackToEditor?: () => void;
  studentInfo?: { nama: string; kelas: string };
  onOpenStudentGate?: () => void;
  onOpenMusicModal?: () => void;
  isMateriCompleted?: boolean;
  isBermainCompleted?: boolean;
  onShowPrerequisiteAlert?: (targetTab: 'bermain' | 'berlatih') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  soundEnabled,
  setSoundEnabled,
  onOpenExport,
  config,
  totalMateri = 4,
  totalGames = 10,
  totalSoal = 10,
  onBackToEditor,
  studentInfo,
  onOpenStudentGate,
  onOpenMusicModal,
  isMateriCompleted = false,
  isBermainCompleted = false,
  onShowPrerequisiteAlert
}) => {
  const currentConfig = config || CONFIG;
  const [bgmStatus, setBgmStatus] = useState(bgm.getStatus());

  useEffect(() => {
    const unsub = bgm.subscribe(() => {
      setBgmStatus(bgm.getStatus());
    });
    return unsub;
  }, []);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    sound.setEnabled(next);
    if (next) sound.playClick();
  };

  const currentTrackObj = BGM_TRACKS.find(t => t.id === bgmStatus.currentTrack);

  const handleTabChange = (tab: 'materi' | 'bermain' | 'berlatih') => {
    if (tab === 'bermain' && !isMateriCompleted) {
      sound.playError();
      onShowPrerequisiteAlert?.('bermain');
      return;
    }

    if (tab === 'berlatih' && (!isMateriCompleted || !isBermainCompleted)) {
      sound.playError();
      onShowPrerequisiteAlert?.('berlatih');
      return;
    }

    sound.playClick();
    setActiveTab(tab);
  };

  return (
    <header className="bg-slate-900 text-white shadow-md border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
          
          {/* Brand Info */}
          <div className="flex items-center gap-3">
            {onBackToEditor && (
              <button
                onClick={() => {
                  sound.playClick();
                  onBackToEditor();
                }}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition flex items-center gap-1.5 text-xs font-bold border border-slate-700"
                title="Kembali ke Editor Generator"
              >
                <ArrowLeft size={16} />
                <span className="hidden sm:inline">Editor Generator</span>
              </button>
            )}
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm border border-blue-400/30 shrink-0">
              MPI
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white truncate">
                  {currentConfig.judul}
                </h1>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-900/60 text-blue-200 border border-blue-700">
                  {currentConfig.fase} ({currentConfig.kelas})
                </span>
              </div>
              <p className="text-xs text-slate-400 truncate">
                {currentConfig.mataPelajaran} • KKM: <span className="font-semibold text-amber-300">{currentConfig.kkm}</span> • Oleh: {currentConfig.namaPengembang || currentConfig.penyusun}
              </p>
            </div>
          </div>

          {/* Action Tools */}
          <div className="flex items-center justify-between md:justify-end gap-2 sm:gap-3 shrink-0 flex-wrap">
            {/* Active Student Badge */}
            {studentInfo?.nama && (
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  onOpenStudentGate?.();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-950/90 text-blue-200 border border-blue-700/80 hover:bg-blue-900 transition"
                title="Klik untuk melihat identitas karya / ubah siswa"
              >
                <span>👤</span>
                <span className="truncate max-w-[150px]">{studentInfo.nama}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-800 text-blue-100 font-semibold">{studentInfo.kelas}</span>
              </button>
            )}

            {/* Background Music (BGM) Toggle & Menu */}
            <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700">
              <button
                type="button"
                id="bgm-quick-toggle-btn"
                onClick={() => {
                  sound.playClick();
                  bgm.togglePlay();
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold transition ${
                  bgmStatus.isPlaying && !bgmStatus.isMuted
                    ? 'bg-teal-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
                title={bgmStatus.isPlaying ? 'Jeda Musik (Pause)' : 'Putar Musik Latar (Play)'}
              >
                {bgmStatus.isPlaying && !bgmStatus.isMuted ? (
                  <>
                    <span className="flex items-center gap-0.5">
                      <span className="w-0.5 h-2.5 bg-white rounded-full animate-pulse" />
                      <span className="w-0.5 h-3.5 bg-teal-200 rounded-full animate-pulse delay-75" />
                      <span className="w-0.5 h-2 bg-white rounded-full animate-pulse delay-150" />
                    </span>
                    <span className="hidden sm:inline">Musik: ON</span>
                  </>
                ) : (
                  <>
                    <Music size={14} />
                    <span className="hidden sm:inline">Musik: OFF</span>
                  </>
                )}
              </button>

              <button
                type="button"
                id="bgm-open-modal-btn"
                onClick={() => {
                  sound.playClick();
                  onOpenMusicModal?.();
                }}
                className="px-2 py-1 rounded-md text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition"
                title="Pilih Lagu / Pengaturan Musik"
              >
                <span>🎵 Pilih</span>
              </button>
            </div>

            {/* Audio Effects Toggle */}
            <button
              id="sound-toggle-btn"
              onClick={toggleSound}
              className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition border ${
                soundEnabled
                  ? 'bg-slate-800 text-emerald-300 border-slate-700 hover:bg-slate-700'
                  : 'bg-slate-800/60 text-slate-400 border-slate-700 hover:bg-slate-700'
              }`}
              title={soundEnabled ? 'Matikan Suara Efek Klik/Benar/Salah' : 'Aktifkan Suara Efek'}
            >
              {soundEnabled ? <Volume2 size={15} className="text-emerald-400" /> : <VolumeX size={15} />}
              <span className="hidden sm:inline">{soundEnabled ? 'SFX: ON' : 'SFX: OFF'}</span>
            </button>

            {/* Standalone Single-File HTML Export Button */}
            <button
              id="export-offline-html-btn"
              onClick={() => {
                sound.playClick();
                onOpenExport();
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 transition shadow-sm border border-amber-400"
            >
              <Download size={15} />
              <span>Ekspor File HTML</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-t border-slate-800 pt-2 pb-1 gap-1 sm:gap-2 overflow-x-auto">
          <button
            id="tab-materi-btn"
            onClick={() => handleTabChange('materi')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'materi'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-300 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <BookOpen size={16} />
            <span>1. Modul Materi</span>
            {isMateriCompleted && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40">
                ✓ Selesai
              </span>
            )}
          </button>

          <button
            id="tab-bermain-btn"
            onClick={() => handleTabChange('bermain')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'bermain'
                ? 'bg-teal-600 text-white shadow-sm'
                : isMateriCompleted
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-400 opacity-70 hover:bg-slate-800/60'
            }`}
            title={!isMateriCompleted ? 'Terkunci: Selesaikan seluruh bab Modul Materi terlebih dahulu' : 'Modul Bermain'}
          >
            {isMateriCompleted ? <Gamepad2 size={16} /> : <Lock size={15} className="text-amber-400" />}
            <span>2. Modul Bermain</span>
            {!isMateriCompleted ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40 flex items-center gap-1">
                🔒 Terkunci
              </span>
            ) : isBermainCompleted ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40">
                ✓ Selesai
              </span>
            ) : null}
          </button>

          <button
            id="tab-berlatih-btn"
            onClick={() => handleTabChange('berlatih')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-bold transition whitespace-nowrap ${
              activeTab === 'berlatih'
                ? 'bg-indigo-600 text-white shadow-sm'
                : isBermainCompleted
                ? 'text-slate-300 hover:bg-slate-800 hover:text-white'
                : 'text-slate-400 opacity-70 hover:bg-slate-800/60'
            }`}
            title={!isBermainCompleted ? 'Terkunci: Selesaikan Modul Materi & Modul Bermain terlebih dahulu' : 'Modul Berlatih Evaluasi'}
          >
            {isBermainCompleted ? <FileCheck2 size={16} /> : <Lock size={15} className="text-amber-400" />}
            <span>3. Modul Berlatih</span>
            {!isBermainCompleted ? (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40 flex items-center gap-1">
                🔒 Terkunci
              </span>
            ) : null}
          </button>
        </div>
      </div>
    </header>
  );
};
