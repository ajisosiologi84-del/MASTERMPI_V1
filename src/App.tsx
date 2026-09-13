import React, { useState, useEffect } from 'react';
import { Sidebar, ActiveMenu } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { IdentitasEditor } from './components/IdentitasEditor';
import { MateriEditorView } from './components/MateriEditorView';
import { GameEditorView } from './components/GameEditorView';
import { SoalEditorView } from './components/SoalEditorView';
import { UploadExcelView } from './components/UploadExcelView';
import { BackupJsonView } from './components/BackupJsonView';
import { MateriView } from './components/MateriView';
import { BermainView } from './components/BermainView';
import { BerlatihView } from './components/BerlatihView';
import { ExportModal } from './components/ExportModal';
import { StudentGateModal } from './components/StudentGateModal';
import { MusicControllerModal } from './components/MusicControllerModal';
import { MusicPromptModal } from './components/MusicPromptModal';
import { BottomBackupBar } from './components/BottomBackupBar';
import { SigmaLogo } from './components/SigmaLogo';
import { CONFIG, MATERI, dataBermain, dtLatih } from './data/mpiData';
import { MpiConfig, MateriItem, GameItem, SoalLatih } from './types';
import { sound } from './utils/audio';
import { bgm } from './utils/bgmEngine';
import { 
  Eye, 
  Download, 
  Settings, 
  Sparkles, 
  WifiOff, 
  ArrowLeft, 
  Layers, 
  CheckCircle2, 
  HelpCircle,
  FileSpreadsheet,
  UserCheck,
  Lock,
  AlertTriangle,
  BookOpen,
  Gamepad2,
  FileCheck2,
  Music
} from 'lucide-react';

const DRAFT_STORAGE_KEY = 'mpi_generator_autosave_draft_v2';

export default function App() {
  // Master Dynamic MPI State with Local Storage Initializer
  const [mpiConfig, setMpiConfig] = useState<MpiConfig>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.config) return parsed.config;
      }
    } catch {
      // fallback
    }
    return CONFIG;
  });

  const [materiList, setMateriList] = useState<MateriItem[]>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.materiList) && parsed.materiList.length > 0) return parsed.materiList;
      }
    } catch {
      // fallback
    }
    return MATERI;
  });

  const [gameList, setGameList] = useState<GameItem[]>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.gameList) && parsed.gameList.length > 0) return parsed.gameList;
      }
    } catch {
      // fallback
    }
    return dataBermain;
  });

  const [soalList, setSoalList] = useState<SoalLatih[]>(() => {
    try {
      const saved = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed.soalList) && parsed.soalList.length > 0) return parsed.soalList;
      }
    } catch {
      // fallback
    }
    return dtLatih;
  });

  // Autosave status state
  const [lastSavedTime, setLastSavedTime] = useState<string>('Baru saja');
  const [isAutoSaving, setIsAutoSaving] = useState<boolean>(false);

  // Auto-Save Effect (Debounced Local Storage)
  useEffect(() => {
    setIsAutoSaving(true);
    const timer = setTimeout(() => {
      try {
        const payload = {
          savedAt: new Date().toISOString(),
          config: mpiConfig,
          materiList,
          gameList,
          soalList
        };
        localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(payload));
        const now = new Date();
        const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
        setLastSavedTime(timeStr);
      } catch (err) {
        console.warn('Gagal menyimpan ke localStorage:', err);
      } finally {
        setIsAutoSaving(false);
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [mpiConfig, materiList, gameList, soalList]);

  // App Navigation State
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('identitas');
  const [previewTab, setPreviewTab] = useState<'materi' | 'bermain' | 'berlatih'>('materi');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMusicModalOpen, setIsMusicModalOpen] = useState(false);
  const [isMusicPromptOpen, setIsMusicPromptOpen] = useState(false);
  const [hasPromptedMusic, setHasPromptedMusic] = useState(false);

  // Student Identity State for Preview
  const [studentInfo, setStudentInfo] = useState<{ nama: string; kelas: string }>({
    nama: 'Budi Pratama',
    kelas: mpiConfig.kelas || 'Kelas XI IPS 1'
  });
  const [isStudentGateOpen, setIsStudentGateOpen] = useState(false);

  // MPI Prerequisite & Progress Tracking
  const [completedBabIds, setCompletedBabIds] = useState<number[]>([]);
  const [completedGamesCount, setCompletedGamesCount] = useState<number>(0);
  const [prereqModalInfo, setPrereqModalInfo] = useState<{
    title: string;
    message: string;
    targetActionTab: 'materi' | 'bermain';
  } | null>(null);

  const isMateriCompleted = completedBabIds.length >= materiList.length;
  const isBermainCompleted = completedGamesCount > 0;

  // Trigger Music Prompt on first Preview or Module activation
  const handleOpenPreviewMode = () => {
    setActiveMenu('preview');
    if (!hasPromptedMusic) {
      setIsMusicPromptOpen(true);
      setHasPromptedMusic(true);
    }
  };

  const handleBabComplete = (babId: number) => {
    setCompletedBabIds(prev => prev.includes(babId) ? prev : [...prev, babId]);
  };

  const handleGameComplete = (_gameIdx: number) => {
    setCompletedGamesCount(prev => prev + 1);
  };

  const handleShowPrerequisiteAlert = (targetTab: 'bermain' | 'berlatih') => {
    if (targetTab === 'bermain') {
      setPrereqModalInfo({
        title: 'Modul Bermain Terkunci!',
        message: 'Sesuai aturan alur MPI: Prasyarat masuk Modul Bermain harus menyelesaikan seluruh bab pada Modul Materi dan menjawab Kuis Mini Refleksi Cepat (Checkpoint Siswa) dengan benar.',
        targetActionTab: 'materi'
      });
    } else {
      setPrereqModalInfo({
        title: 'Modul Berlatih Terkunci!',
        message: 'Sesuai aturan alur MPI: Prasyarat masuk Modul Berlatih harus menyelesaikan Modul Materi dan Modul Bermain terlebih dahulu sebelum membuka asesmen evaluasi.',
        targetActionTab: isMateriCompleted ? 'bermain' : 'materi'
      });
    }
  };

  const handleRestoreData = (data: {
    config: MpiConfig;
    materiList: MateriItem[];
    gameList: GameItem[];
    soalList: SoalLatih[];
  }) => {
    setMpiConfig(data.config);
    setMateriList(data.materiList);
    setGameList(data.gameList);
    setSoalList(data.soalList);
  };

  const handleResetToDefault = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setMpiConfig(CONFIG);
    setMateriList(MATERI);
    setGameList(dataBermain);
    setSoalList(dtLatih);
  };

  const isPreviewMode = activeMenu === 'preview';

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
      
      {/* Top Application Header Bar */}
      <header className="bg-slate-950 text-white border-b border-slate-800 py-2.5 px-4 sm:px-6 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <SigmaLogo 
              size="sm"
              showText={false}
              animated={true}
              onClick={() => setActiveMenu('identitas')}
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-1.5">
                  <span className="bg-gradient-to-r from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">MASTERMPI</span>
                  <span className="text-cyan-400 font-medium text-xs hidden sm:inline">| Smart MPI Engine</span>
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  Kurikulum Merdeka
                </span>
                <span className="hidden md:inline-block px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  @ajisosiologi 2026
                </span>
                <span className="hidden lg:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/30" title="Draft otomatis tersimpan di peramban">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  {isAutoSaving ? 'Menyimpan...' : `Draft Tersimpan (${lastSavedTime})`}
                </span>
              </div>
              <div className="text-[11px] text-slate-400 hidden md:block">
                {mpiConfig.judul} • {mpiConfig.mataPelajaran} ({mpiConfig.fase} - {mpiConfig.kelas})
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Switch to Preview / Editor */}
            {!isPreviewMode ? (
              <button
                id="header-switch-preview-btn"
                onClick={() => {
                  sound.playClick();
                  handleOpenPreviewMode();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-xs transition flex items-center gap-1.5"
              >
                <Eye size={14} />
                <span>Buka Live Preview</span>
              </button>
            ) : (
              <button
                id="header-switch-editor-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveMenu('identitas');
                }}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition flex items-center gap-1.5"
              >
                <ArrowLeft size={14} />
                <span>Kembali ke Editor</span>
              </button>
            )}

            {/* Quick BGM Modal Button */}
            <button
              id="header-music-btn"
              onClick={() => {
                sound.playClick();
                setIsMusicModalOpen(true);
              }}
              className="px-3 py-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-teal-200 font-bold text-xs border border-teal-700/60 transition flex items-center gap-1.5"
              title="Pengaturan Musik Latar (BGM)"
            >
              <Music size={14} className="text-teal-400" />
              <span className="hidden sm:inline">Musik Latar</span>
            </button>

            {/* Ekspor HTML Offline Button */}
            <button
              id="header-export-offline-btn"
              onClick={() => {
                sound.playSuccess();
                setIsExportOpen(true);
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-xs transition flex items-center gap-1.5 border border-amber-400"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Ekspor File HTML Offline</span>
              <span className="sm:hidden">Ekspor</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Workspace Body */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Vertical Menu for MPI Builder */}
        <Sidebar
          activeMenu={activeMenu}
          onSelectMenu={(menu) => {
            if (menu === 'preview') {
              handleOpenPreviewMode();
            } else {
              setActiveMenu(menu);
            }
          }}
          onOpenExportModal={() => setIsExportOpen(true)}
          config={mpiConfig}
          totalMateri={materiList.length}
          totalGames={gameList.length}
          totalSoal={soalList.length}
          isCollapsed={isSidebarCollapsed}
          onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        />

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto flex flex-col bg-slate-100 pb-20 md:pb-0">
          
          {/* MENU 1: IDENTITAS MPI */}
          {activeMenu === 'identitas' && (
            <IdentitasEditor
              config={mpiConfig}
              onChangeConfig={setMpiConfig}
              onGoToPreview={handleOpenPreviewMode}
            />
          )}

          {/* MENU 2: PENYUSUN MATERI */}
          {activeMenu === 'materi' && (
            <MateriEditorView
              materiList={materiList}
              onUpdateMateriList={setMateriList}
              onGoToPreview={handleOpenPreviewMode}
              soalList={soalList}
              config={mpiConfig}
            />
          )}

          {/* MENU 3: PENYUSUN GAME */}
          {activeMenu === 'bermain' && (
            <GameEditorView
              gameList={gameList}
              onUpdateGameList={setGameList}
              onGoToPreview={handleOpenPreviewMode}
              soalList={soalList}
              config={mpiConfig}
            />
          )}

          {/* MENU 4: PENYUSUN SOAL EVALUASI */}
          {activeMenu === 'soal' && (
            <SoalEditorView
              soalList={soalList}
              onUpdateSoalList={setSoalList}
              onGoToUploadExcel={() => setActiveMenu('upload_excel')}
              onGoToPreview={handleOpenPreviewMode}
            />
          )}

          {/* MENU 5: UPLOAD SOAL FORMAT EXCEL */}
          {activeMenu === 'upload_excel' && (
            <UploadExcelView
              currentSoalList={soalList}
              onUpdateSoalList={setSoalList}
              onGoToPreview={handleOpenPreviewMode}
              onNavigateMenu={(menu) => setActiveMenu(menu)}
            />
          )}

          {/* MENU 6: LIVE PREVIEW KONDISI SEBELUM EKSPOR HTML OFFLINE */}
          {activeMenu === 'preview' && (
            <div className="flex-1 flex flex-col animate-fade-in">
              
              {/* Preview Banner Notice */}
              <div className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white px-4 py-2 text-xs flex flex-col sm:flex-row items-center justify-between gap-2 shadow-inner border-b border-blue-800">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold">
                    Mode Live Preview Interaktif:
                  </span>
                  <span className="text-blue-200">
                    Ini adalah simulasi tampilan & logika MPI persis seperti yang akan dihasilkan pada file HTML Offline.
                  </span>
                </div>
                <div className="flex items-center gap-2 shrink-0 flex-wrap">
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsStudentGateOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-md bg-blue-500/30 hover:bg-blue-500/50 text-blue-100 text-[11px] font-bold transition flex items-center gap-1 border border-blue-400/30"
                    title="Simulasikan alur gerbang isian siswa & animasi identitas karya"
                  >
                    <UserCheck size={13} />
                    <span>Uji Gerbang Masuk Siswa</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setIsMusicModalOpen(true);
                    }}
                    className="px-2.5 py-1 rounded-md bg-teal-500/30 hover:bg-teal-500/50 text-teal-100 text-[11px] font-bold transition flex items-center gap-1 border border-teal-400/30"
                    title="Pengaturan Musik Pengiring"
                  >
                    <Music size={13} />
                    <span>Musik Latar</span>
                  </button>
                  <button
                    onClick={() => {
                      sound.playClick();
                      setActiveMenu('upload_excel');
                    }}
                    className="px-2.5 py-1 rounded-md bg-white/10 hover:bg-white/20 text-white text-[11px] font-semibold transition"
                  >
                    Upload Excel
                  </button>
                  <button
                    onClick={() => {
                      sound.playSuccess();
                      setIsExportOpen(true);
                    }}
                    className="px-3 py-1 rounded-md bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-[11px] font-black transition shadow-xs"
                  >
                    Ekspor HTML
                  </button>
                </div>
              </div>

              {/* Student View Navigation Header */}
              <Navbar
                activeTab={previewTab}
                setActiveTab={setPreviewTab}
                soundEnabled={soundEnabled}
                setSoundEnabled={setSoundEnabled}
                onOpenExport={() => setIsExportOpen(true)}
                config={mpiConfig}
                totalMateri={materiList.length}
                totalGames={gameList.length}
                totalSoal={soalList.length}
                onBackToEditor={() => setActiveMenu('identitas')}
                studentInfo={studentInfo}
                onOpenStudentGate={() => setIsStudentGateOpen(true)}
                onOpenMusicModal={() => setIsMusicModalOpen(true)}
                isMateriCompleted={isMateriCompleted}
                isBermainCompleted={isBermainCompleted}
                onShowPrerequisiteAlert={handleShowPrerequisiteAlert}
              />

              {/* MPI Flow & Progress Ribbon */}
              <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-slate-300">
                    <span className="font-black text-amber-400 uppercase tracking-wider text-[10px] px-2 py-0.5 rounded bg-amber-500/20 border border-amber-400/30">
                      Alur Wajib MPI
                    </span>
                    <span className="text-slate-400">
                      1. Materi (Kuis Mini) ➔ 2. Bermain Game ➔ 3. Berlatih Evaluasi
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Status Modul 1 */}
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${isMateriCompleted ? 'bg-emerald-400' : 'bg-blue-400 animate-pulse'}`} />
                      <span>Materi: <strong>{completedBabIds.length}/{materiList.length} Bab</strong></span>
                      {isMateriCompleted && <CheckCircle2 size={13} className="text-emerald-400" />}
                    </div>

                    <span className="text-slate-600">•</span>

                    {/* Status Modul 2 */}
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${isBermainCompleted ? 'bg-emerald-400' : isMateriCompleted ? 'bg-teal-400 animate-pulse' : 'bg-slate-600'}`} />
                      <span>Bermain: <strong>{isBermainCompleted ? 'Selesai' : isMateriCompleted ? 'Terbuka' : 'Terkunci'}</strong></span>
                      {!isMateriCompleted ? <Lock size={12} className="text-amber-400" /> : isBermainCompleted ? <CheckCircle2 size={13} className="text-emerald-400" /> : null}
                    </div>

                    <span className="text-slate-600">•</span>

                    {/* Status Modul 3 */}
                    <div className="flex items-center gap-1.5 text-slate-300">
                      <span className={`w-2 h-2 rounded-full ${isBermainCompleted ? 'bg-indigo-400' : 'bg-slate-600'}`} />
                      <span>Berlatih: <strong>{isBermainCompleted ? 'Terbuka' : 'Terkunci'}</strong></span>
                      {!isBermainCompleted && <Lock size={12} className="text-amber-400" />}
                    </div>
                  </div>
                </div>
              </div>

              {/* Interactive Module Screens */}
              <div className="flex-1">
                {previewTab === 'materi' && (
                  <MateriView 
                    materiList={materiList} 
                    completedBabIds={completedBabIds}
                    onBabComplete={handleBabComplete}
                    isMateriCompleted={isMateriCompleted}
                    onNavigateTab={(tab) => setPreviewTab(tab)}
                  />
                )}
                {previewTab === 'bermain' && (
                  <BermainView 
                    gameList={gameList} 
                    onGameComplete={handleGameComplete}
                    isBermainCompleted={isBermainCompleted}
                    onNavigateTab={(tab) => setPreviewTab(tab)}
                  />
                )}
                {previewTab === 'berlatih' && (
                  <BerlatihView soalList={soalList} config={mpiConfig} />
                )}
              </div>

              {/* Interactive Footer Showing Author Metadata */}
              <footer className="bg-white border-t border-slate-200 py-4 px-4 sm:px-6">
                <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
                  <div>
                    <strong className="text-slate-800">{mpiConfig.judul}</strong> • {mpiConfig.mataPelajaran} ({mpiConfig.kelas} / {mpiConfig.fase})
                    {mpiConfig.topikMateri && (
                      <span className="block text-[11px] text-slate-400 mt-0.5">Topik: {mpiConfig.topikMateri}</span>
                    )}
                  </div>
                  <div className="text-right sm:text-right text-xs">
                    <span>Pengembang: <strong className="text-slate-800">{mpiConfig.namaPengembang || mpiConfig.penyusun}</strong></span>
                    {mpiConfig.sekolah && <span> • {mpiConfig.sekolah}</span>}
                    {mpiConfig.mediaSosial && (
                      <span className="block text-[11px] text-blue-600 font-medium mt-0.5">{mpiConfig.mediaSosial}</span>
                    )}
                  </div>
                </div>
              </footer>

            </div>
          )}

          {/* MENU 7: CADANGAN PORTABEL (MASTER BACKUP JSON) */}
          {activeMenu === 'backup_json' && (
            <BackupJsonView
              config={mpiConfig}
              materiList={materiList}
              gameList={gameList}
              soalList={soalList}
              lastSavedTime={lastSavedTime}
              isAutoSaving={isAutoSaving}
              onRestoreData={handleRestoreData}
              onGoToPreview={handleOpenPreviewMode}
            />
          )}

          {/* MENU PALING BAWAH: PUSAT BACKUP DATA HTML & JSON LENGKAP */}
          <BottomBackupBar
            config={mpiConfig}
            materiList={materiList}
            gameList={gameList}
            soalList={soalList}
            lastSavedTime={lastSavedTime}
            isAutoSaving={isAutoSaving}
            onRestoreData={handleRestoreData}
            onResetToDefault={handleResetToDefault}
          />

        </main>

      </div>

      {/* Standalone Single-File HTML Export Modal */}
      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
        config={mpiConfig}
        materi={materiList}
        bermain={gameList}
        latih={soalList}
      />

      {/* Music Controller Settings Modal */}
      <MusicControllerModal
        isOpen={isMusicModalOpen}
        onClose={() => setIsMusicModalOpen(false)}
        config={mpiConfig}
        onChangeConfig={(newCfg) => setMpiConfig(newCfg)}
      />

      {/* Music Prompt Modal on Module Entry */}
      <MusicPromptModal
        isOpen={isMusicPromptOpen}
        onClose={() => setIsMusicPromptOpen(false)}
        onOpenMusicSettings={() => {
          setIsMusicPromptOpen(false);
          setIsMusicModalOpen(true);
        }}
        config={mpiConfig}
        onChangeConfig={(newCfg) => setMpiConfig(newCfg)}
      />

      {/* Student Gate Intro & Identity Modal for Live Preview */}
      <StudentGateModal
        isOpen={isStudentGateOpen}
        config={mpiConfig}
        totalMateri={materiList.length}
        totalGames={gameList.length}
        totalSoal={soalList.length}
        initialStudent={studentInfo}
        isMateriCompleted={isMateriCompleted}
        isBermainCompleted={isBermainCompleted}
        onGoToEditIdentitas={() => {
          setIsStudentGateOpen(false);
          setActiveMenu('identitas');
        }}
        onComplete={(student, targetTab) => {
          setStudentInfo(student);
          if (targetTab) {
            handleOpenPreviewMode();
            setPreviewTab(targetTab === 'latih' ? 'berlatih' : targetTab);
          }
          setIsStudentGateOpen(false);
        }}
        onClose={() => setIsStudentGateOpen(false)}
      />

      {/* Prerequisite Alert Dialog Modal */}
      {prereqModalInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs animate-fade-in">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-amber-200 animate-slide-up">
            <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-4 mx-auto shadow-inner">
              <Lock size={28} />
            </div>
            
            <h3 className="text-lg sm:text-xl font-black text-slate-900 text-center mb-2">
              {prereqModalInfo.title}
            </h3>

            <p className="text-xs sm:text-sm text-slate-600 text-center mb-6 leading-relaxed">
              {prereqModalInfo.message}
            </p>

            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setPreviewTab(prereqModalInfo.targetActionTab);
                  setPrereqModalInfo(null);
                }}
                className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2"
              >
                {prereqModalInfo.targetActionTab === 'materi' ? (
                  <>
                    <BookOpen size={16} />
                    <span>Lanjutkan Belajar di Modul Materi</span>
                  </>
                ) : (
                  <>
                    <Gamepad2 size={16} />
                    <span>Lanjutkan Bermain di Modul Game</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={() => setPrereqModalInfo(null)}
                className="w-full py-2.5 px-4 rounded-xl text-slate-600 hover:bg-slate-100 font-bold text-xs transition"
              >
                Tutup Peringatan
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

