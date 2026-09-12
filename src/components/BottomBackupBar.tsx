import React, { useRef, useState } from 'react';
import { 
  Download, 
  FileCode, 
  FileJson, 
  Upload, 
  CheckCircle2, 
  Sparkles, 
  Database, 
  Layers, 
  HardDrive,
  ShieldCheck,
  AlertCircle,
  Clock,
  RotateCcw
} from 'lucide-react';
import { MpiConfig, MateriItem, GameItem, SoalLatih } from '../types';
import { generateStandaloneMpiHtml } from '../utils/standaloneHtmlGenerator';
import { sound } from '../utils/audio';
import { SigmaLogo } from './SigmaLogo';

interface BottomBackupBarProps {
  config: MpiConfig;
  materiList: MateriItem[];
  gameList: GameItem[];
  soalList: SoalLatih[];
  lastSavedTime?: string;
  isAutoSaving?: boolean;
  onRestoreData?: (data: {
    config: MpiConfig;
    materiList: MateriItem[];
    gameList: GameItem[];
    soalList: SoalLatih[];
  }) => void;
  onResetToDefault?: () => void;
}

export const BottomBackupBar: React.FC<BottomBackupBarProps> = ({
  config,
  materiList,
  gameList,
  soalList,
  lastSavedTime = 'Baru saja',
  isAutoSaving = false,
  onRestoreData,
  onResetToDefault
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // Download Standalone HTML Backup
  const handleBackupHtml = () => {
    sound.playSuccess();
    const htmlContent = generateStandaloneMpiHtml(
      config,
      materiList,
      gameList,
      soalList
    );

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (config.judul || 'MPI_Offline')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `backup_mpi_${safeTitle}_${dateStr}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Berkas HTML Standalone berhasil di-backup & diunduh!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // Download JSON Master Data Backup
  const handleBackupJson = () => {
    sound.playSuccess();
    const backupData = {
      backupVersion: '2.0.0',
      exportedAt: new Date().toISOString(),
      generatorName: 'MPI Offline Builder - Era AI Transformasi Pendidikan',
      config,
      materiList,
      gameList,
      soalList,
      metadata: {
        totalMateri: materiList.length,
        totalGame: gameList.length,
        totalSoal: soalList.length,
        kkm: config.kkm,
        mataPelajaran: config.mataPelajaran,
        kelas: config.kelas
      }
    };

    const jsonString = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeTitle = (config.judul || 'MPI_Data')
      .replace(/[^a-zA-Z0-9_-]/g, '_')
      .toLowerCase();
    const dateStr = new Date().toISOString().slice(0, 10);
    a.href = url;
    a.download = `backup_mpi_data_${safeTitle}_${dateStr}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Master Dataset JSON berhasil di-backup & diunduh!');
    setTimeout(() => setDownloadSuccess(null), 4000);
  };

  // Restore from JSON File
  const handleFileJsonChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = JSON.parse(text);

        if (!parsed.config || !parsed.materiList || !parsed.gameList || !parsed.soalList) {
          throw new Error('Format berkas JSON tidak sesuai struktur MPI');
        }

        sound.playSuccess();
        onRestoreData?.({
          config: parsed.config,
          materiList: parsed.materiList,
          gameList: parsed.gameList,
          soalList: parsed.soalList
        });

        setDownloadSuccess('Data MPI berhasil dipulihkan (Restore) dari berkas JSON!');
        setTimeout(() => setDownloadSuccess(null), 5000);
        setRestoreError(null);
      } catch {
        sound.playError();
        setRestoreError('Gagal memulihkan data: Format berkas JSON tidak valid.');
        setTimeout(() => setRestoreError(null), 5000);
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) {
      jsonInputRef.current.value = '';
    }
  };

  return (
    <section className="bg-slate-900 border-t-2 border-slate-700 text-white py-6 px-4 sm:px-6 lg:px-8 shadow-2xl mt-auto">
      <div className="max-w-7xl mx-auto">
        
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
          
          {/* Info Status Dataset & Auto-Save */}
          <div className="flex items-start gap-3.5">
            <SigmaLogo 
              size="md"
              showText={false}
              animated={true}
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-extrabold text-base text-white flex items-center gap-2">
                  <span>MASTERMPI: Pusat Cadangan &amp; Penyimpanan Proyek</span>
                </h4>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 flex items-center gap-1">
                  <ShieldCheck size={12} /> {isAutoSaving ? 'Menyimpan Otomatis...' : `Autosave Aktif (${lastSavedTime})`}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  @ajisosiologi 2026
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Draft tersimpan otomatis di memori peramban (LocalStorage). Smart MPI &amp; Gamification Engine oleh @ajisosiologi 2026. Anda dapat menutup browser kapan saja dan melanjutkannya esok hari, atau unduh master JSON untuk cadangan offline permanen.
              </p>
            </div>
          </div>

          {/* Action Buttons: HTML, JSON, and Import */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap w-full lg:w-auto">
            
            {/* 1. Backup HTML */}
            <button
              type="button"
              id="bottom-backup-html-btn"
              onClick={handleBackupHtml}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition shadow-md flex items-center justify-center gap-2 border border-amber-400 cursor-pointer"
              title="Unduh seluruh aplikasi mandiri 100% offline format .HTML"
            >
              <FileCode size={16} />
              <span>Backup Format HTML</span>
            </button>

            {/* 2. Backup JSON */}
            <button
              type="button"
              id="bottom-backup-json-btn"
              onClick={handleBackupJson}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs transition shadow-md flex items-center justify-center gap-2 border border-blue-400/30 cursor-pointer"
              title="Unduh dataset mentah format .JSON untuk disimpan / dipindahkan ke perangkat lain"
            >
              <FileJson size={16} />
              <span>Backup Format JSON</span>
            </button>

            {/* 3. Restore JSON */}
            <input
              type="file"
              ref={jsonInputRef}
              onChange={handleFileJsonChange}
              accept=".json,application/json"
              className="hidden"
            />
            <button
              type="button"
              id="bottom-restore-json-btn"
              onClick={() => jsonInputRef.current?.click()}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs transition border border-slate-600 flex items-center justify-center gap-2 cursor-pointer"
              title="Pulihkan data proyek MPI dari file .JSON yang pernah di-backup sebelumnya"
            >
              <Upload size={16} />
              <span>Pulihkan (Restore) JSON</span>
            </button>

            {/* 4. Reset Default (Opsional) */}
            {onResetToDefault && (
              <button
                type="button"
                id="bottom-reset-btn"
                onClick={() => setShowResetConfirm(true)}
                className="p-2.5 rounded-xl bg-slate-800/80 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 transition border border-slate-700 flex items-center justify-center cursor-pointer"
                title="Reset seluruh data ke template awal"
              >
                <RotateCcw size={16} />
              </button>
            )}

          </div>

        </div>

        {/* Reset Confirmation Dialog */}
        {showResetConfirm && (
          <div className="mt-4 p-4 rounded-xl bg-rose-950/90 border border-rose-600/60 flex flex-col sm:flex-row items-center justify-between gap-3 animate-slide-up">
            <div className="flex items-center gap-2 text-rose-200 text-xs font-semibold">
              <AlertCircle size={18} className="text-rose-400 shrink-0" />
              <span>Kembalikan seluruh data materi, game, dan soal ke template contoh bawaan?</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold hover:bg-slate-700 transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  sound.playSuccess();
                  setShowResetConfirm(false);
                  onResetToDefault?.();
                }}
                className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-xs font-black transition shadow"
              >
                Ya, Reset ke Standar
              </button>
            </div>
          </div>
        )}

        {/* Notifications & Feedback */}
        {downloadSuccess && (
          <div className="mt-3.5 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs font-bold flex items-center gap-2 animate-slide-up">
            <CheckCircle2 size={16} className="text-emerald-400 shrink-0" />
            <span>{downloadSuccess}</span>
          </div>
        )}

        {restoreError && (
          <div className="mt-3.5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs font-bold flex items-center gap-2 animate-slide-up">
            <AlertCircle size={16} className="text-rose-400 shrink-0" />
            <span>{restoreError}</span>
          </div>
        )}

      </div>
    </section>
  );
};

