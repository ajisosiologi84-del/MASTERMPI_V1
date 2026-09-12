import React, { useState, useRef } from 'react';
import { 
  FileJson, 
  Upload, 
  Download, 
  HardDrive, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  FileCode,
  Laptop,
  Smartphone,
  Share2,
  RefreshCw
} from 'lucide-react';
import { MpiConfig, MateriItem, GameItem, SoalLatih } from '../types';
import { generateStandaloneMpiHtml } from '../utils/standaloneHtmlGenerator';
import { sound } from '../utils/audio';
import { SigmaLogo } from './SigmaLogo';

interface BackupJsonViewProps {
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
  onGoToPreview?: () => void;
}

export const BackupJsonView: React.FC<BackupJsonViewProps> = ({
  config,
  materiList,
  gameList,
  soalList,
  lastSavedTime = 'Baru saja',
  isAutoSaving = false,
  onRestoreData,
  onGoToPreview
}) => {
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [restoreError, setRestoreError] = useState<string | null>(null);
  const [copiedRawJson, setCopiedRawJson] = useState<boolean>(false);
  const jsonInputRef = useRef<HTMLInputElement>(null);

  // Generate Master JSON Payload
  const getMasterDataPayload = () => ({
    format: 'MPI_MERDEKA_MASTER_BACKUP_V2',
    version: '2.0',
    exportedAt: new Date().toISOString(),
    author: config.namaPengembang || config.penyusun,
    school: config.sekolah,
    config: config,
    materiList: materiList,
    gameList: gameList,
    soalList: soalList,
    summary: {
      totalMateri: materiList.length,
      totalGame: gameList.length,
      totalSoal: soalList.length
    }
  });

  // Handle Master JSON Export
  const handleDownloadJson = () => {
    sound.playSuccess();
    const data = getMasterDataPayload();
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (config.judul || 'Proyek_MPI').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.setAttribute('download', `MASTER_BACKUP_${safeTitle}_${new Date().toISOString().slice(0,10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('Berkas Master Cadangan JSON berhasil diunduh ke komputer Anda.');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  // Handle Standalone HTML Export
  const handleDownloadHtml = () => {
    sound.playSuccess();
    const htmlContent = generateStandaloneMpiHtml(config, materiList, gameList, soalList);
    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const safeTitle = (config.judul || 'MPI_Merdeka').replace(/[^a-zA-Z0-9_-]/g, '_');
    link.href = url;
    link.setAttribute('download', `MPI_${safeTitle}_OFFLINE.html`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess('File HTML Offline Mandiri berhasil di-generate dan diunduh!');
    setTimeout(() => setDownloadSuccess(null), 5000);
  };

  // Handle Restore JSON File
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (!parsed || typeof parsed !== 'object') {
          throw new Error('File JSON tidak berstruktur data objek yang valid');
        }

        const newConfig = parsed.config || config;
        const newMateri = Array.isArray(parsed.materiList) ? parsed.materiList : (Array.isArray(parsed.materi) ? parsed.materi : materiList);
        const newGame = Array.isArray(parsed.gameList) ? parsed.gameList : (Array.isArray(parsed.bermain) ? parsed.bermain : gameList);
        const newSoal = Array.isArray(parsed.soalList) ? parsed.soalList : (Array.isArray(parsed.latih) ? parsed.latih : soalList);

        if (onRestoreData) {
          onRestoreData({
            config: newConfig,
            materiList: newMateri,
            gameList: newGame,
            soalList: newSoal
          });
        }

        sound.playSuccess();
        setDownloadSuccess(`Data proyek "${newConfig.judul || 'MPI'}" berhasil dipulihkan dari berkas JSON!`);
        setTimeout(() => setDownloadSuccess(null), 6000);
        setRestoreError(null);
      } catch {
        sound.playError();
        setRestoreError('Gagal memulihkan: Format berkas JSON rusak atau bukan berkas Master Cadangan MPI yang valid.');
        setTimeout(() => setRestoreError(null), 6000);
      }
    };
    reader.readAsText(file);
    if (jsonInputRef.current) jsonInputRef.current.value = '';
  };

  // Copy Raw JSON to Clipboard
  const handleCopyClipboard = () => {
    try {
      const data = getMasterDataPayload();
      navigator.clipboard.writeText(JSON.stringify(data, null, 2));
      sound.playClick();
      setCopiedRawJson(true);
      setTimeout(() => setCopiedRawJson(false), 3000);
    } catch {
      // fallback
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6 animate-fade-in">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-6 sm:p-8 text-white border border-indigo-800/50 shadow-xl relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4">
            <SigmaLogo 
              size="md"
              showText={false}
              animated={true}
            />
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider uppercase bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 flex items-center gap-1.5">
                  <ShieldCheck size={14} /> MASTERMPI Master Sync
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  {isAutoSaving ? 'Menyimpan Otomatis...' : `Autosave Browser Aktif (${lastSavedTime})`}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-400/30">
                  @ajisosiologi 2026
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white mt-2">
                Cadangan Portabel (Master Backup JSON MASTERMPI)
              </h2>
              <p className="text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                Pusat manajemen dan pemindahan draf proyek MPI Anda. Simpan master data untuk melanjutkan pengerjaan di komputer/laptop lain esok hari tanpa takut data hilang. Smart MPI &amp; Gamification Engine oleh @ajisosiologi 2026.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {onGoToPreview && (
              <button
                type="button"
                onClick={onGoToPreview}
                className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs border border-slate-700 transition flex items-center gap-2 cursor-pointer shadow"
              >
                <span>Buka Live Preview</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Notifications */}
      {downloadSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-950/90 border border-emerald-500/50 text-emerald-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-lg animate-slide-up">
          <CheckCircle2 size={20} className="text-emerald-400 shrink-0" />
          <span>{downloadSuccess}</span>
        </div>
      )}

      {restoreError && (
        <div className="p-4 rounded-2xl bg-rose-950/90 border border-rose-500/50 text-rose-200 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-lg animate-slide-up">
          <AlertCircle size={20} className="text-rose-400 shrink-0" />
          <span>{restoreError}</span>
        </div>
      )}

      {/* 2 Main Action Columns */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Card 1: Ekspor Master JSON */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-black">
                <Download size={24} />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800">
                Langkah Ekspor
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                1. Unduh Master Backup JSON
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Simpan seluruh dataset lengkap (Identitas, {materiList.length} Bab Materi Teori, {gameList.length} Game Interaktif, dan {soalList.length} Soal Evaluasi HOTS) dalam 1 berkas <code>.json</code> ringan.
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Materi</span>
                <span className="text-sm font-black text-slate-800">{materiList.length} Bab</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Game</span>
                <span className="text-sm font-black text-slate-800">{gameList.length} Aktivitas</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-center">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Soal HOTS</span>
                <span className="text-sm font-black text-slate-800">{soalList.length} Butir</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <button
              type="button"
              id="btn-download-master-json"
              onClick={handleDownloadJson}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 group cursor-pointer"
            >
              <FileJson size={18} className="group-hover:scale-110 transition" />
              <span>Unduh Master Backup (.JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleCopyClipboard}
              className="w-full py-2.5 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              {copiedRawJson ? (
                <>
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span className="text-emerald-700">Teks JSON Berhasil Disalin!</span>
                </>
              ) : (
                <>
                  <Copy size={15} />
                  <span>Salin Teks Raw JSON ke Clipboard</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Card 2: Pulihkan (Restore) JSON */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-black">
                <Upload size={24} />
              </div>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                Langkah Pulihkan
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900">
                2. Pulihkan (Restore) Data Proyek
              </h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Buka file <code>.json</code> yang pernah Anda unduh dari laptop atau komputer lain untuk melanjutkan penyusunan media pembelajaran secara instan.
              </p>
            </div>

            {/* Hidden File Input */}
            <input
              ref={jsonInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileUpload}
              className="hidden"
            />

            <div 
              onClick={() => jsonInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-2xl p-6 text-center bg-slate-50/50 hover:bg-emerald-50/30 transition cursor-pointer group"
            >
              <Upload size={28} className="mx-auto text-slate-400 group-hover:text-emerald-600 transition mb-2" />
              <div className="text-xs font-black text-slate-800">
                Klik atau Seret Berkas .JSON ke Sini
              </div>
              <div className="text-[11px] text-slate-400 mt-0.5">
                Mendukung Master Backup JSON format resmi
              </div>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="button"
              id="btn-upload-master-json"
              onClick={() => jsonInputRef.current?.click()}
              className="w-full py-3.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload size={18} />
              <span>Pilih & Muat Berkas Master JSON</span>
            </button>
          </div>
        </div>

      </div>

      {/* Guide Section: Cara Bekerja Antar Perangkat */}
      <div className="bg-slate-900 text-slate-200 rounded-3xl p-6 sm:p-7 border border-slate-800 space-y-4">
        <h4 className="text-sm sm:text-base font-extrabold text-white flex items-center gap-2">
          <Share2 size={18} className="text-indigo-400" />
          <span>Panduan Alur Pindah Perangkat (Laptop Rumah ➔ Komputer Sekolah)</span>
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-1">
          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-blue-600 text-white font-black flex items-center justify-center text-xs">
              1
            </div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <Laptop size={14} className="text-blue-400" /> Di Laptop Rumah
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Selesai menyusun draf materi atau game, klik tombol <strong>"Unduh Master Backup (.JSON)"</strong>. Simpan file di Flashdisk atau kirim ke WhatsApp / Google Drive Anda.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-emerald-600 text-white font-black flex items-center justify-center text-xs">
              2
            </div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <RefreshCw size={14} className="text-emerald-400" /> Di Komputer Sekolah
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Buka aplikasi MPI Generator di browser komputer sekolah, masuk ke menu <strong>Cadangan Portabel (JSON)</strong>, lalu klik <strong>"Pilih & Muat Berkas Master JSON"</strong>.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/80 border border-slate-700 space-y-2">
            <div className="w-7 h-7 rounded-xl bg-amber-600 text-white font-black flex items-center justify-center text-xs">
              3
            </div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <Smartphone size={14} className="text-amber-400" /> Hasil 100% Utuh
            </div>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              Seluruh data identitas, materi, game, dan bank soal akan langsung terisi kembali persis seperti terakhir Anda kerjakan, siap dilanjutkan atau diekspor ke file HTML offline.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
