import React, { useState } from 'react';
import { MpiConfig } from '../types';
import { sound } from '../utils/audio';
import { SigmaLogo } from './SigmaLogo';
import { 
  User, 
  GraduationCap, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  BookOpen, 
  School, 
  Layers, 
  Target, 
  UserCheck, 
  Camera, 
  Rocket,
  CheckCircle2,
  Gamepad2,
  ChevronRight,
  Lock,
  AlertTriangle
} from 'lucide-react';

interface StudentGateModalProps {
  isOpen: boolean;
  config: MpiConfig;
  totalMateri?: number;
  totalGames?: number;
  totalSoal?: number;
  onComplete: (student: { nama: string; kelas: string }, targetTab?: 'materi' | 'bermain' | 'latih') => void;
  initialStudent?: { nama: string; kelas: string };
  onClose?: () => void;
  onGoToEditIdentitas?: () => void;
  isMateriCompleted?: boolean;
  isBermainCompleted?: boolean;
}

export const StudentGateModal: React.FC<StudentGateModalProps> = ({
  isOpen,
  config,
  totalMateri = 4,
  totalGames = 10,
  totalSoal = 10,
  onComplete,
  initialStudent,
  onClose,
  onGoToEditIdentitas,
  isMateriCompleted = false,
  isBermainCompleted = false
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [nama, setNama] = useState(initialStudent?.nama || '');
  const [kelas, setKelas] = useState(initialStudent?.kelas || config.kelas || 'Kelas XI');
  const [errorMessage, setErrorMessage] = useState('');
  const [prereqNotice, setPrereqNotice] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleNextToStep2 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim()) {
      sound.playError();
      setErrorMessage('Mohon isikan nama lengkap siswa terlebih dahulu.');
      return;
    }
    if (!kelas.trim()) {
      sound.playError();
      setErrorMessage('Mohon isikan kelas / rombel siswa.');
      return;
    }
    sound.playSuccess();
    setErrorMessage('');
    setStep(2);
  };

  const handleNextToStep3 = () => {
    sound.playSuccess();
    setPrereqNotice(null);
    setStep(3);
  };

  const handleSelectModule = (targetTab: 'materi' | 'bermain' | 'latih') => {
    if (targetTab === 'bermain' && !isMateriCompleted) {
      sound.playError();
      setPrereqNotice('⚠️ Modul Bermain Masih Terkunci! Sesuai aturan MPI, Anda wajib menyelesaikan seluruh bab pada Modul Belajar (Materi) dan menjawab Kuis Mini Refleksi dengan benar terlebih dahulu.');
      return;
    }

    if (targetTab === 'latih' && (!isMateriCompleted || !isBermainCompleted)) {
      sound.playError();
      setPrereqNotice('⚠️ Modul Berlatih Masih Terkunci! Sesuai aturan MPI, Anda wajib menyelesaikan Modul Belajar dan Modul Bermain terlebih dahulu sebelum mengerjakan Soal Evaluasi.');
      return;
    }

    sound.playSuccess();
    onComplete({
      nama: nama.trim(),
      kelas: kelas.trim()
    }, targetTab);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md overflow-y-auto animate-fade-in overscroll-contain">
      <div className={`w-full my-auto transition-all duration-300 ${step === 3 ? 'max-w-5xl' : 'max-w-xl'}`}>
        
        {/* =========================================================================
            STEP 1: TAMPILAN AWAL - HANYA ISIAN NAMA LENGKAP & KELAS (TANPA LAINNYA)
           ========================================================================= */}
        {step === 1 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-bounce-in max-h-[92dvh] flex flex-col">
            {/* Clean, Minimalist Header */}
            <div className="bg-slate-900 text-white p-5 sm:p-7 text-center relative shrink-0 border-b border-slate-800">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight leading-snug text-white">
                Masukkan Identitas Siswa
              </h1>
              <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-md mx-auto">
                Silakan isi nama lengkap dan kelas Anda untuk memulai pembelajaran
              </p>
            </div>

            {/* Form Area - Focused & Clean */}
            <form onSubmit={handleNextToStep2} className="p-5 sm:p-8 space-y-5 overflow-y-auto flex-1">
              {errorMessage && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold text-center animate-shake">
                  {errorMessage}
                </div>
              )}

              {/* Input Nama Lengkap Siswa */}
              <div>
                <label 
                  htmlFor="input-student-name"
                  className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
                >
                  <User size={15} className="text-blue-600" />
                  <span>Nama Lengkap Siswa <span className="text-rose-500">*</span></span>
                </label>
                <input
                  id="input-student-name"
                  type="text"
                  autoFocus
                  value={nama}
                  onChange={(e) => {
                    setNama(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="Ketik nama lengkap Anda di sini..."
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs bg-slate-50/70"
                  required
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Nama Anda akan otomatis dicetak pada sertifikat &amp; kartu hasil evaluasi.
                </span>
              </div>

              {/* Input Kelas Siswa */}
              <div>
                <label 
                  htmlFor="input-student-class"
                  className="block text-xs font-black uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5"
                >
                  <GraduationCap size={15} className="text-blue-600" />
                  <span>Kelas / Rombel Siswa <span className="text-rose-500">*</span></span>
                </label>
                <input
                  id="input-student-class"
                  type="text"
                  value={kelas}
                  onChange={(e) => {
                    setKelas(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder={`Contoh: ${config.kelas || 'Kelas XI'} IPS 1`}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-300 text-slate-900 text-base font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-xs bg-slate-50/70"
                  required
                />
              </div>

              {/* Action Button */}
              <div className="pt-3">
                <button
                  type="submit"
                  id="btn-gate-continue"
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-base shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 group cursor-pointer active:scale-98"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </form>
          </div>
        )}

        {/* =========================================================================
            STEP 2: MENU KE-2 - IDENTITAS KARYA MEDIA PEMBELAJARAN (8 POIN)
            (Baru muncul setelah nama & kelas diisi di Step 1)
           ========================================================================= */}
        {step === 2 && (
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden animate-slide-up max-h-[92dvh] flex flex-col">
            
            {/* Header Identity */}
            <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-6 border-b border-slate-800 shrink-0">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[11px] font-black uppercase tracking-wider truncate max-w-[230px] sm:max-w-none">
                  <CheckCircle2 size={13} className="shrink-0" />
                  <span className="truncate">Siswa: {nama} ({kelas})</span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {onGoToEditIdentitas && (
                    <button
                      type="button"
                      onClick={() => {
                        sound.playClick();
                        onGoToEditIdentitas();
                      }}
                      className="text-xs text-amber-300 hover:text-amber-200 flex items-center gap-1 transition cursor-pointer py-1 px-2.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 font-bold"
                      title="Edit metadata & profil pendidik"
                    >
                      <span>✏️ Edit Identitas</span>
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      sound.playClick();
                      setStep(1);
                    }}
                    className="text-xs text-slate-300 hover:text-white flex items-center gap-1 transition cursor-pointer py-1 px-2 rounded-lg bg-white/10 hover:bg-white/20"
                  >
                    <ArrowLeft size={12} />
                    <span>Ubah Nama</span>
                  </button>
                </div>
              </div>

              <h2 className="text-lg sm:text-xl md:text-2xl font-black text-white tracking-tight flex items-center gap-2">
                <Sparkles className="text-amber-400 shrink-0" size={20} />
                <span>1. Identitas Karya Media Pembelajaran :</span>
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-300 mt-0.5">
                Informasi kurikulum, capaian belajar, serta profil pendidik pembuat karya.
              </p>
            </div>

            {/* List 8 Poin Identitas Karya - Fully Scrollable & Optimized for Mobile Screens */}
            <div className="p-4 sm:p-6 space-y-3.5 overflow-y-auto flex-1">
              
              <div className="grid grid-cols-1 gap-3">
                
                {/* 1. NAMA (Judul Karya MPI) */}
                <div className="p-3.5 rounded-2xl bg-blue-50/80 border border-blue-200/80 flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-blue-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    1
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-blue-800 tracking-wider block">
                      1. NAMA (Judul Karya MPI) :
                    </span>
                    <span className="text-sm sm:text-base font-black text-slate-900 leading-snug block">
                      {config.judul}
                    </span>
                  </div>
                </div>

                {/* 2. Mata Pelajaran */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    2
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                      2. Mata Pelajaran :
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                      {config.mataPelajaran}
                    </span>
                  </div>
                </div>

                {/* 3. Kelas/Fase */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    3
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                      3. Kelas/Fase :
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                      {config.kelas} / {config.fase}
                    </span>
                  </div>
                </div>

                {/* 4. Topik Materi / Elemen / Materi */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-indigo-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    4
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                      4. Topik Materi / Elemen / Materi :
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                      {config.topikMateri || config.judul}
                    </span>
                  </div>
                </div>

                {/* 5. Tujuan Pembelajaran / Sub-elemen / Submateri */}
                <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-amber-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    5
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-amber-800 tracking-wider block">
                      5. Tujuan Pembelajaran / Sub-elemen / Submateri :
                    </span>
                    <p className="text-xs sm:text-sm font-medium text-slate-800 leading-relaxed mt-0.5">
                      {config.tujuanPembelajaran || 'Peserta didik mampu memahami dan menganalisis substansi materi secara interaktif.'}
                    </p>
                  </div>
                </div>

                {/* 6. Nama Pengembang */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    6
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                      6. Nama Pengembang :
                    </span>
                    <span className="text-xs sm:text-sm font-black text-slate-900 block">
                      {config.namaPengembang || config.penyusun || 'Pendidik Kreatif'}
                    </span>
                  </div>
                </div>

                {/* 7. Asal Sekolah */}
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    7
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="text-[10px] sm:text-[11px] font-black uppercase text-slate-500 tracking-wider block">
                      7. Asal Sekolah :
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block">
                      {config.sekolah || config.instansi || 'SMA Unggulan'}
                    </span>
                  </div>
                </div>

                {/* 8. FOTO PROFIL PENGEMBANG */}
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50 border border-emerald-200 flex items-start sm:items-center gap-3">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-emerald-600 text-white font-black text-xs sm:text-sm flex items-center justify-center shrink-0 shadow-xs">
                    8
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 flex-1">
                    {/* Foto Profil */}
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-white shrink-0 flex items-center justify-center">
                      {config.fotoProfil ? (
                        <img
                          src={config.fotoProfil}
                          alt="Foto Profil Pengembang"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80';
                          }}
                        />
                      ) : (
                        <span className="text-xl font-black text-emerald-600">
                          {(config.namaPengembang || 'P').charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] sm:text-[11px] font-black uppercase text-emerald-800 tracking-wider block">
                        8. FOTO PROFIL PENGEMBANG :
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 block truncate">
                        {config.namaPengembang || config.penyusun || 'Pendidik'}
                      </span>
                      {config.jabatan && (
                        <span className="text-[11px] text-emerald-800 font-semibold block truncate">
                          {config.jabatan}
                        </span>
                      )}
                      <span className="text-xs text-slate-600 block truncate">
                        {config.sekolah || config.instansi || 'Pendidik Kurikulum Merdeka'}
                        {config.nip ? ` • NIP: ${config.nip}` : ''}
                      </span>
                      {(config.mediaSosial || config.kontak) && (
                        <span className="text-[11px] text-teal-700 font-semibold block mt-0.5 truncate">
                          {[config.mediaSosial, config.kontak].filter(Boolean).join(' • ')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

              </div>

              {/* Greeting note for student */}
              <div className="p-3 rounded-2xl bg-slate-100 border border-slate-200 text-center text-xs text-slate-700 font-medium">
                Selamat belajar, <strong>{nama}</strong> ({kelas})! Manfaatkan materi, mini-game interaktif, dan evaluasi HOTS secara maksimal.
              </div>

              {/* Proceed to Activity Selection (Step 3) */}
              <div className="pt-2 sticky bottom-0 bg-white/95 backdrop-blur-xs py-2">
                <button
                  type="button"
                  id="btn-gate-to-step3"
                  onClick={handleNextToStep3}
                  className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-700 hover:to-indigo-700 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition flex items-center justify-center gap-2.5 cursor-pointer group active:scale-98"
                >
                  <span>Pilih Aktivitas Pembelajaran →</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </button>
              </div>

            </div>

          </div>
        )}

        {/* STEP 3: PILIHAN MODUL (SEPERTI GAMBAR USER: "Mau melakukan apa hari ini?") */}
        {step === 3 && (
          <div className="bg-[#fcf8f2] rounded-3xl sm:rounded-[36px] shadow-2xl border border-[#e8ded1] overflow-hidden animate-slide-up p-6 sm:p-10 md:p-12 relative">
            
            {/* Top Bar: Student indicator & Back button */}
            <div className="flex items-center justify-between gap-3 mb-6 pb-4 border-b border-[#ebdcca]">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-xs border border-slate-200 text-xs font-bold text-slate-700">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Peserta Didik: <strong>{nama}</strong> ({kelas})</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  sound.playClick();
                  setStep(2);
                }}
                className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition cursor-pointer px-3 py-1.5 rounded-lg hover:bg-white/60"
              >
                <ArrowLeft size={14} />
                <span>Lihat Identitas Karya</span>
              </button>
            </div>

            {/* Headline matching user's image */}
            <div className="text-center mb-6 sm:mb-8">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#9c2518] tracking-tight leading-tight">
                Mau melakukan apa hari ini?
              </h1>
              <p className="text-slate-600 text-sm sm:text-base md:text-lg mt-2.5 max-w-xl mx-auto font-normal">
                Mulailah dari <strong className="text-slate-900 font-black">Belajar</strong>, lanjut ke <strong className="text-slate-900 font-black">Bermain</strong>, lalu uji dirimu di <strong className="text-slate-900 font-black">Berlatih</strong>.
              </p>
            </div>

            {/* Prerequisite Alert Banner */}
            {prereqNotice && (
              <div className="mb-6 p-4 rounded-2xl bg-amber-500/20 border-2 border-amber-500/50 text-amber-950 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-md animate-bounce-in">
                <div className="flex items-start gap-2.5 text-xs sm:text-sm font-bold text-left">
                  <AlertTriangle className="text-amber-700 shrink-0 mt-0.5" size={20} />
                  <span>{prereqNotice}</span>
                </div>
                <button
                  type="button"
                  onClick={() => handleSelectModule('materi')}
                  className="px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-black text-xs shrink-0 shadow-sm transition flex items-center gap-1.5"
                >
                  <BookOpen size={14} />
                  <span>Mulai dari Belajar Materi</span>
                </button>
              </div>
            )}

            {/* 3 Interactive Modern Cards with Contemporary Circular Icons */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-7">
              
              {/* CARD 1: BELAJAR (Materi Pembelajaran) */}
              <button
                type="button"
                id="btn-select-belajar"
                onClick={() => handleSelectModule('materi')}
                className="w-full bg-white hover:bg-slate-50/80 rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-lg hover:shadow-2xl hover:-translate-y-2.5 transition-all duration-300 cursor-pointer group min-h-[360px] border-2 border-slate-100 hover:border-blue-400/60 relative overflow-hidden"
              >
                {/* Status Badge */}
                <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-700 flex items-center gap-1 text-[11px] font-black border border-emerald-500/30 shadow-xs">
                  <CheckCircle2 size={13} className="text-emerald-600" />
                  <span>Terbuka</span>
                </div>

                {/* Modern Circular Icon Container */}
                <div className="relative mt-2">
                  {/* Ambient Glow */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-300"></div>
                  
                  {/* Outer Ring & Main Circular Orb */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-1 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white/95 flex flex-col items-center justify-center p-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-50 to-blue-100/90 text-blue-700 flex items-center justify-center shadow-inner group-hover:rotate-3 transition-transform">
                        <BookOpen size={28} className="text-blue-600 stroke-[2.3]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Label */}
                <div className="my-4">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block group-hover:text-blue-600 transition-colors">
                    Belajar
                  </span>
                  <span className="text-xs text-slate-500 font-medium block mt-1">
                    Pelajari modul & konsep materi
                  </span>
                </div>

                {/* Modern Pill Chip */}
                <div className="w-full">
                  <div className="px-5 py-2.5 rounded-2xl bg-slate-100 text-slate-700 text-xs sm:text-sm font-black tracking-wide border border-slate-200 group-hover:bg-blue-50 group-hover:text-blue-700 group-hover:border-blue-200 transition">
                    Materi Pembelajaran
                  </div>
                </div>
              </button>

              {/* CARD 2: BERMAIN (Permainan Interaktif) */}
              <button
                type="button"
                id="btn-select-bermain"
                onClick={() => handleSelectModule('bermain')}
                className={`w-full bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-lg transition-all duration-300 cursor-pointer group min-h-[360px] border-2 relative overflow-hidden ${
                  isMateriCompleted 
                    ? 'hover:bg-slate-50/80 hover:shadow-2xl hover:-translate-y-2.5 border-slate-100 hover:border-rose-400/60' 
                    : 'border-slate-200/80 opacity-90'
                }`}
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1 text-[11px] font-black border shadow-xs ${
                  isMateriCompleted 
                    ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' 
                    : 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                }`}>
                  {isMateriCompleted ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Lock size={13} className="text-amber-600" />}
                  <span>{isMateriCompleted ? 'Terbuka ✨' : 'Terkunci'}</span>
                </div>

                {/* Modern Circular Icon Container */}
                <div className="relative mt-2">
                  {/* Ambient Glow */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-rose-500 to-pink-600 opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-300"></div>
                  
                  {/* Outer Ring & Main Circular Orb */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-400 p-1 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white/95 flex flex-col items-center justify-center p-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-rose-50 to-pink-100/90 text-rose-700 flex items-center justify-center shadow-inner group-hover:-rotate-3 transition-transform">
                        <Gamepad2 size={28} className="text-rose-600 stroke-[2.3]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Label */}
                <div className="my-4">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block group-hover:text-rose-600 transition-colors">
                    Bermain
                  </span>
                  <span className="text-xs text-slate-500 font-medium block mt-1">
                    Uji pemahaman lewat mini-games
                  </span>
                </div>

                {/* Modern Pill Chip */}
                <div className="w-full">
                  <div className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black tracking-wide border transition ${
                    isMateriCompleted 
                      ? 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-rose-50 group-hover:text-rose-700 group-hover:border-rose-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isMateriCompleted ? `${totalGames} Permainan Interaktif` : '🔒 Selesaikan Belajar'}
                  </div>
                </div>
              </button>

              {/* CARD 3: BERLATIH (Soal Evaluasi) */}
              <button
                type="button"
                id="btn-select-berlatih"
                onClick={() => handleSelectModule('latih')}
                className={`w-full bg-white rounded-3xl p-6 sm:p-8 flex flex-col items-center justify-between text-center shadow-lg transition-all duration-300 cursor-pointer group min-h-[360px] border-2 relative overflow-hidden ${
                  isBermainCompleted 
                    ? 'hover:bg-slate-50/80 hover:shadow-2xl hover:-translate-y-2.5 border-slate-100 hover:border-amber-400/60' 
                    : 'border-slate-200/80 opacity-90'
                }`}
              >
                {/* Status Badge */}
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full flex items-center gap-1 text-[11px] font-black border shadow-xs ${
                  isBermainCompleted 
                    ? 'bg-emerald-500/15 text-emerald-700 border-emerald-500/30' 
                    : 'bg-amber-500/15 text-amber-700 border-amber-500/30'
                }`}>
                  {isBermainCompleted ? <CheckCircle2 size={13} className="text-emerald-600" /> : <Lock size={13} className="text-amber-600" />}
                  <span>{isBermainCompleted ? 'Terbuka ✨' : 'Terkunci'}</span>
                </div>

                {/* Modern Circular Icon Container */}
                <div className="relative mt-2">
                  {/* Ambient Glow */}
                  <div className="absolute -inset-2 rounded-full bg-gradient-to-tr from-amber-500 to-orange-600 opacity-20 group-hover:opacity-40 blur-md transition-opacity duration-300"></div>
                  
                  {/* Outer Ring & Main Circular Orb */}
                  <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full bg-gradient-to-tr from-amber-500 via-orange-500 to-yellow-400 p-1 shadow-xl group-hover:scale-105 transition-transform duration-300">
                    <div className="w-full h-full rounded-full bg-white/95 flex flex-col items-center justify-center p-3">
                      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-50 to-orange-100/90 text-amber-700 flex items-center justify-center shadow-inner group-hover:rotate-6 transition-transform">
                        <Target size={28} className="text-amber-600 stroke-[2.3]" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Main Label */}
                <div className="my-4">
                  <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight block group-hover:text-amber-600 transition-colors">
                    Berlatih
                  </span>
                  <span className="text-xs text-slate-500 font-medium block mt-1">
                    Evaluasi capaian & cetak kartu hasil
                  </span>
                </div>

                {/* Modern Pill Chip */}
                <div className="w-full">
                  <div className={`px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-black tracking-wide border transition ${
                    isBermainCompleted 
                      ? 'bg-slate-100 text-slate-700 border-slate-200 group-hover:bg-amber-50 group-hover:text-amber-700 group-hover:border-amber-200' 
                      : 'bg-amber-50 text-amber-800 border-amber-200'
                  }`}>
                    {isBermainCompleted ? `${totalSoal} Soal Evaluasi` : '🔒 Selesaikan Bermain'}
                  </div>
                </div>
              </button>

            </div>

            {/* Quick helper footer */}
            <div className="mt-8 text-center">
              <span className="text-xs text-slate-500 font-medium">
                💡 Klik salah satu kartu di atas untuk langsung membuka modul yang Anda inginkan.
              </span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

