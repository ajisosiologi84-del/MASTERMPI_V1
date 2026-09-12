import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { dtLatih, CONFIG } from '../data/mpiData';
import { SoalLatih, MpiConfig } from '../types';
import { sound } from '../utils/audio';
import { generateScorePdf, StudentScoreData } from '../utils/pdfGenerator';
import { MediaDisplay } from './MediaDisplay';
import { getAnimationClasses } from '../utils/animationHelper';
import { 
  CheckCircle2, 
  XCircle, 
  HelpCircle, 
  Award, 
  RotateCcw, 
  ChevronRight, 
  ChevronLeft, 
  FileText,
  Lightbulb,
  Check,
  Download,
  Printer,
  Sparkles,
  User,
  GraduationCap,
  Calendar,
  Share2
} from 'lucide-react';

interface BerlatihViewProps {
  soalList?: SoalLatih[];
  config?: MpiConfig;
}

export const BerlatihView: React.FC<BerlatihViewProps> = ({ soalList, config }) => {
  const rawList = soalList && soalList.length > 0 ? soalList : dtLatih;
  const filteredList = rawList.filter(q => q.aktifUntukBerlatih !== false);
  const activeList = filteredList.length > 0 ? filteredList : rawList;
  const activeCfg = config || CONFIG;

  const [activeNo, setActiveNo] = useState(0);
  const [answers, setAnswers] = useState<{ [key: number]: any }>({});
  const [submitted, setSubmitted] = useState<{ [key: number]: boolean }>({});
  const [showRapor, setShowRapor] = useState(false);

  // Student Identity for PDF Report
  const [namaSiswa, setNamaSiswa] = useState('');
  const [nomorInduk, setNomorInduk] = useState('');
  const [kelasSiswa, setKelasSiswa] = useState(activeCfg.kelas || 'XI');
  const [sekolahSiswa, setSekolahSiswa] = useState(activeCfg.sekolah || '');

  // Animated score counter state
  const [animatedScore, setAnimatedScore] = useState(0);

  // Guard if activeNo exceeds length
  const safeIdx = Math.min(activeNo, activeList.length - 1);
  const currentSoal: SoalLatih = activeList[safeIdx] || activeList[0];
  const isCurrentSubmitted = submitted[safeIdx] || false;
  const currentAnswer = answers[safeIdx];

  // Verify answer correctness
  const isAnswerCorrect = (index: number): boolean => {
    const q = activeList[index];
    if (!q) return false;
    const ans = answers[index];
    if (ans === undefined || ans === null) return false;

    if (q.t === 'pg') {
      return ans === q.j;
    } else if (q.t === 'pg_kompleks') {
      if (!Array.isArray(ans) || !Array.isArray(q.j)) return false;
      const sortedAns = [...ans].sort();
      const sortedKey = [...(q.j as number[])].sort();
      return JSON.stringify(sortedAns) === JSON.stringify(sortedKey);
    } else if (q.t === 'jodoh') {
      return ans === 1;
    } else if (q.t === 'drag_word') {
      if (!Array.isArray(ans) || !Array.isArray(q.j)) return false;
      if (ans.length !== q.j.length) return false;
      return ans.every((word, i) => word === (q.j as string[])[i]);
    }
    return false;
  };

  const calculateScore = () => {
    let correct = 0;
    for (let i = 0; i < activeList.length; i++) {
      if (isAnswerCorrect(i)) correct++;
    }
    return Math.round((correct / activeList.length) * 100);
  };

  const totalAnswered = Object.keys(submitted).length;
  const score = calculateScore();
  const isLulus = score >= activeCfg.kkm;

  // Trigger celebration confetti & score counter animation when Rapor opens
  useEffect(() => {
    if (showRapor) {
      if (isLulus) {
        sound.playSuccess();
        // Fire celebration confetti cannon
        confetti({
          particleCount: 90,
          spread: 70,
          origin: { y: 0.6 }
        });
        setTimeout(() => {
          confetti({
            particleCount: 50,
            angle: 60,
            spread: 55,
            origin: { x: 0 }
          });
          confetti({
            particleCount: 50,
            angle: 120,
            spread: 55,
            origin: { x: 1 }
          });
        }, 300);
      }

      // Smooth score count-up animation
      let start = 0;
      const target = score;
      const duration = 1200; // 1.2s
      const steps = 30;
      const stepTime = duration / steps;
      const increment = target / steps;

      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setAnimatedScore(target);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.round(start));
        }
      }, stepTime);

      return () => clearInterval(timer);
    } else {
      setAnimatedScore(0);
    }
  }, [showRapor, score, isLulus]);

  const handleDownloadPdf = () => {
    sound.playSuccess();
    const studentData: StudentScoreData = {
      namaSiswa: namaSiswa.trim() || 'Peserta Didik',
      nomorInduk: nomorInduk.trim() || '001',
      kelas: kelasSiswa.trim() || activeCfg.kelas,
      sekolah: sekolahSiswa.trim() || activeCfg.sekolah || 'SMA Kurikulum Merdeka',
      score,
      kkm: activeCfg.kkm,
      totalSoal: activeList.length,
      totalBenar: activeList.filter((_, i) => isAnswerCorrect(i)).length,
      totalSalah: activeList.filter((_, i) => !isAnswerCorrect(i)).length,
      answers,
      isAnswerCorrect,
      tanggal: new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    };

    generateScorePdf(activeCfg, activeList, studentData);
  };

  const handleSelectPg = (optIdx: number) => {
    if (isCurrentSubmitted) return;
    sound.playClick();
    setAnswers(prev => ({ ...prev, [activeNo]: optIdx }));
  };

  const handleToggleMcma = (optIdx: number) => {
    if (isCurrentSubmitted) return;
    sound.playClick();
    const currentList: number[] = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    let updated: number[];
    if (currentList.includes(optIdx)) {
      updated = currentList.filter(i => i !== optIdx);
    } else {
      updated = [...currentList, optIdx];
    }
    setAnswers(prev => ({ ...prev, [activeNo]: updated }));
  };

  const handleSelectJodoh = (val: number) => {
    if (isCurrentSubmitted) return;
    sound.playClick();
    setAnswers(prev => ({ ...prev, [activeNo]: val }));
  };

  const handleAddDragWord = (word: string) => {
    if (isCurrentSubmitted) return;
    sound.playClick();
    const currentList: string[] = Array.isArray(currentAnswer) ? [...currentAnswer] : [];
    if (currentList.length < 3 && !currentList.includes(word)) {
      setAnswers(prev => ({ ...prev, [activeNo]: [...currentList, word] }));
    }
  };

  const handleResetDragWords = () => {
    if (isCurrentSubmitted) return;
    sound.playClick();
    setAnswers(prev => ({ ...prev, [activeNo]: [] }));
  };

  const handleSubmitSoal = () => {
    if (currentAnswer === undefined || currentAnswer === null || (Array.isArray(currentAnswer) && currentAnswer.length === 0)) {
      alert('Silakan tentukan jawaban terlebih dahulu!');
      return;
    }

    setSubmitted(prev => ({ ...prev, [activeNo]: true }));

    if (isAnswerCorrect(activeNo)) {
      sound.playSuccess();
    } else {
      sound.playError();
    }
  };

  const handleResetAll = () => {
    sound.playClick();
    setAnswers({});
    setSubmitted({});
    setActiveNo(0);
    setShowRapor(false);
  };

  const animClasses = currentSoal ? getAnimationClasses(currentSoal.animasi) : '';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Question Matrix Navigation */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6 no-print">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <FileText className="text-indigo-600" size={20} />
              <span>Modul Berlatih: {activeList.length} Soal Asesmen HOTS Kurikulum Merdeka</span>
            </h2>
            <p className="text-xs text-slate-500">
              Pilihan Ganda Sederhana, Pilihan Ganda Kompleks (MCMA), dan Menjodohkan / Drag Word
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full">
              Dijawab: {totalAnswered} / {activeList.length}
            </span>
            {totalAnswered === activeList.length && (
              <button
                id="view-report-btn"
                onClick={() => {
                  sound.playSuccess();
                  setShowRapor(true);
                }}
                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-full text-xs font-bold transition shadow-xs flex items-center gap-1 anim-pulse"
              >
                <Award size={14} />
                <span>Lihat Nilai & Rekap PDF</span>
              </button>
            )}
          </div>
        </div>

        {/* Number Grid */}
        <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
          {activeList.map((q, idx) => {
            const isCurrent = idx === activeNo;
            const isDone = submitted[idx];
            const correct = isDone && isAnswerCorrect(idx);

            let btnStyle = 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100';
            if (isCurrent) {
              btnStyle = 'bg-indigo-600 text-white border-indigo-700 shadow-sm ring-2 ring-indigo-400/40 font-bold';
            } else if (isDone) {
              btnStyle = correct
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold'
                : 'bg-rose-50 text-rose-800 border-rose-300 font-bold';
            }

            return (
              <button
                key={q.no || idx}
                id={`soal-nav-btn-${q.no || idx}`}
                onClick={() => {
                  sound.playClick();
                  setActiveNo(idx);
                  setShowRapor(false);
                }}
                className={`py-2 px-1 rounded-lg border text-xs text-center transition-all flex flex-col items-center justify-center relative ${btnStyle}`}
              >
                <span className="font-extrabold">{idx + 1}</span>
                <span className="text-[9px] uppercase tracking-tighter opacity-80">
                  {q.t === 'pg_kompleks' ? 'MCMA' : q.t}
                </span>
                {isDone && (
                  <span className={`absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-[9px] text-white ${
                    correct ? 'bg-emerald-600' : 'bg-rose-600'
                  }`}>
                    {correct ? '✓' : '✕'}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* RAPOR NILAI / RESULT MODAL WITH SPECTACULAR ANIMATION & PDF DOWNLOAD */}
      {showRapor ? (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl p-6 sm:p-10 text-center animate-fade-in relative overflow-hidden">
          
          {/* Subtle decorative background glow */}
          <div className={`absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full blur-3xl opacity-20 pointer-events-none ${
            isLulus ? 'bg-emerald-500' : 'bg-rose-500'
          }`} />

          {/* Top Status Pill */}
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold uppercase tracking-wider mb-6 border shadow-xs bg-slate-50 text-slate-700 border-slate-200">
            <Sparkles size={14} className={isLulus ? 'text-emerald-600' : 'text-rose-600'} />
            <span>Hasil Evaluasi Asesmen MPI Mandiri</span>
          </div>

          {/* Animated Circular SVG Progress Meter */}
          <div className="relative w-44 h-44 mx-auto mb-6 flex items-center justify-center">
            <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                className="text-slate-100"
                strokeWidth="10"
                stroke="currentColor"
                fill="transparent"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                className={`transition-all duration-1000 ease-out ${
                  isLulus ? 'text-emerald-500' : 'text-rose-500'
                }`}
                strokeWidth="10"
                strokeDasharray={2 * Math.PI * 50}
                strokeDashoffset={2 * Math.PI * 50 * (1 - animatedScore / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
              />
            </svg>

            {/* Inner Score Label */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-5xl font-black tracking-tight leading-none ${
                isLulus ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {animatedScore}
              </span>
              <span className="text-[11px] uppercase font-extrabold text-slate-400 mt-1 tracking-wider">
                Skor Nilai / 100
              </span>
            </div>
          </div>

          {/* Headings */}
          <h3 className="text-2xl sm:text-3xl font-black text-slate-900 mb-2">
            {isLulus ? '🎉 Tuntas Kriteria Ketercapaian (KKM)!' : '📚 Perlu Penguatan & Pendalaman'}
          </h3>
          <p className="text-sm text-slate-600 max-w-lg mx-auto mb-6 leading-relaxed">
            {isLulus
              ? `Selamat! Anda berhasil melampaui batas KKM (${activeCfg.kkm}) dengan penguasaan kompetensi sosiologis yang sangat baik.`
              : `Skor Anda ${score} dari batas KKM ${activeCfg.kkm}. Ulas kembali materi dan ringkasan kunci konsep untuk mempersiapkan remedial.`}
          </p>

          {/* 4 Metrics Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto mb-8 text-left">
            <div className="p-3.5 bg-emerald-50/80 rounded-2xl border border-emerald-200 text-emerald-900">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Jawaban Benar</span>
              <span className="text-xl font-black text-emerald-900">
                {activeList.filter((_, i) => isAnswerCorrect(i)).length} <span className="text-xs font-normal">Soal</span>
              </span>
            </div>

            <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200 text-rose-900">
              <span className="text-[10px] uppercase font-bold text-rose-700 block">Jawaban Salah</span>
              <span className="text-xl font-black text-rose-900">
                {activeList.filter((_, i) => !isAnswerCorrect(i)).length} <span className="text-xs font-normal">Soal</span>
              </span>
            </div>

            <div className="p-3.5 bg-indigo-50/80 rounded-2xl border border-indigo-200 text-indigo-900">
              <span className="text-[10px] uppercase font-bold text-indigo-700 block">Target KKM</span>
              <span className="text-xl font-black text-indigo-900">
                {activeCfg.kkm} <span className="text-xs font-normal">Poin</span>
              </span>
            </div>

            <div className="p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200 text-amber-900">
              <span className="text-[10px] uppercase font-bold text-amber-700 block">Tingkat Akurasi</span>
              <span className="text-xl font-black text-amber-900">
                {score}%
              </span>
            </div>
          </div>

          {/* STUDENT FORM FOR PDF REPORT */}
          <div className="max-w-xl mx-auto mb-8 p-5 bg-slate-50 border border-slate-200 rounded-2xl text-left space-y-3">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200">
              <GraduationCap className="text-indigo-600" size={18} />
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                Isi Identitas untuk Unduh Berkas PDF Rekap Rapor:
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nama Lengkap Peserta Didik
                </label>
                <input
                  type="text"
                  value={namaSiswa}
                  onChange={(e) => setNamaSiswa(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  NIS / No. Absen
                </label>
                <input
                  type="text"
                  value={nomorInduk}
                  onChange={(e) => setNomorInduk(e.target.value)}
                  placeholder="Contoh: 20241108 / 14"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Kelas / Rombel
                </label>
                <input
                  type="text"
                  value={kelasSiswa}
                  onChange={(e) => setKelasSiswa(e.target.value)}
                  placeholder="Contoh: XI-Sosiologi 1"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Sekolah / Madrasah
                </label>
                <input
                  type="text"
                  value={sekolahSiswa}
                  onChange={(e) => setSekolahSiswa(e.target.value)}
                  placeholder="Contoh: SMA Negeri 1 Jakarta"
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 bg-white text-slate-900 font-semibold focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                id="download-score-pdf-btn"
                type="button"
                onClick={handleDownloadPdf}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-extrabold text-xs sm:text-sm shadow-md transition flex items-center justify-center gap-2 anim-hover-lift"
              >
                <Download size={18} />
                <span>Unduh Rekap Laporan Evaluasi Lengkap (Format PDF Resmi)</span>
              </button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 no-print">
            <button
              id="rapor-review-btn"
              onClick={() => {
                sound.playClick();
                setShowRapor(false);
                setActiveNo(0);
              }}
              className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm transition shadow-xs flex items-center gap-1.5"
            >
              <FileText size={15} />
              <span>Review Pembahasan Soal</span>
            </button>

            <button
              id="rapor-print-btn"
              onClick={() => window.print()}
              className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm transition flex items-center gap-1.5"
            >
              <Printer size={15} />
              <span>Cetak Hasil</span>
            </button>

            <button
              id="rapor-reset-btn"
              onClick={handleResetAll}
              className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold text-xs sm:text-sm transition flex items-center justify-center gap-1.5"
            >
              <RotateCcw size={15} />
              <span>Ulangi Evaluasi</span>
            </button>
          </div>

        </div>
      ) : (
        /* ACTIVE QUESTION CONTAINER WITH ANIMATION & MEDIA DISPLAY */
        <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 ${animClasses}`}>
          
          {/* Header of Active Question */}
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase tracking-wider bg-indigo-100 text-indigo-800">
                {currentSoal.t === 'pg' && 'Pilihan Ganda Sederhana'}
                {currentSoal.t === 'pg_kompleks' && 'Pilihan Ganda Kompleks (MCMA)'}
                {currentSoal.t === 'jodoh' && 'Menjodohkan Konsep'}
                {currentSoal.t === 'drag_word' && 'Mengisi Rumpang Kalimat'}
              </span>
              <span className="text-xs text-slate-500 font-semibold">
                Soal {activeNo + 1} dari {activeList.length}
              </span>
            </div>

            {isCurrentSubmitted && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                isAnswerCorrect(activeNo)
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                {isAnswerCorrect(activeNo) ? <CheckCircle2 size={14} /> : <XCircle size={14} />}
                {isAnswerCorrect(activeNo) ? 'Jawaban Benar' : 'Jawaban Salah'}
              </span>
            )}
          </div>

          {/* Top Media Attached to Question (e.g. Stimulus Gambar / Infografis / Video / Audio) */}
          <MediaDisplay mediaList={currentSoal.mediaList} posisiFilter="atas" />

          {/* HOTS Stimulus Box if present */}
          {currentSoal.stimulus && (
            <div className="bg-slate-50 border-l-4 border-indigo-600 p-4 rounded-r-lg mb-5 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              <span className="text-[11px] font-bold text-indigo-900 uppercase tracking-wider block mb-1">
                Wacana Stimulus Sosiologis:
              </span>
              {currentSoal.stimulus}
            </div>
          )}

          {/* Question Text */}
          <div className="text-sm sm:text-base font-bold text-slate-900 mb-5 leading-relaxed">
            {currentSoal.tanya}
          </div>

          {/* -----------------------------------------------------------
              1. TIPE 'pg' (Pilihan Ganda Sederhana)
          ----------------------------------------------------------- */}
          {currentSoal.t === 'pg' && currentSoal.opsi && (
            <div className="space-y-2.5 mb-6">
              {currentSoal.opsi.map((opsiText, optIdx) => {
                const isSelected = currentAnswer === optIdx;
                let optionStyle = 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-800';

                if (isCurrentSubmitted) {
                  if (optIdx === currentSoal.j) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                  } else {
                    optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-400/20';
                }

                return (
                  <button
                    key={optIdx}
                    id={`soal-${activeNo}-opt-${optIdx}`}
                    disabled={isCurrentSubmitted}
                    onClick={() => handleSelectPg(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{opsiText}</span>
                    {isCurrentSubmitted && optIdx === currentSoal.j && (
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* -----------------------------------------------------------
              2. TIPE 'pg_kompleks' (MCMA Multiple Choice Multi Answer)
          ----------------------------------------------------------- */}
          {currentSoal.t === 'pg_kompleks' && currentSoal.opsi && (
            <div className="space-y-2.5 mb-6">
              <span className="text-xs text-slate-500 font-semibold block mb-2">
                *Pilihlah satu atau lebih pilihan jawaban yang sesuai:
              </span>
              {currentSoal.opsi.map((opsiText, optIdx) => {
                const selectedArr: number[] = Array.isArray(currentAnswer) ? currentAnswer : [];
                const isSelected = selectedArr.includes(optIdx);
                const isKey = Array.isArray(currentSoal.j) && (currentSoal.j as number[]).includes(optIdx);

                let optionStyle = 'bg-white border-slate-200 hover:border-indigo-300 hover:bg-slate-50 text-slate-800';

                if (isCurrentSubmitted) {
                  if (isKey) {
                    optionStyle = 'bg-emerald-50 border-emerald-400 text-emerald-950 font-bold';
                  } else if (isSelected) {
                    optionStyle = 'bg-rose-50 border-rose-300 text-rose-950';
                  } else {
                    optionStyle = 'bg-white border-slate-200 text-slate-400 opacity-60';
                  }
                } else if (isSelected) {
                  optionStyle = 'bg-indigo-50/80 border-indigo-600 text-indigo-950 font-bold ring-2 ring-indigo-400/20';
                }

                return (
                  <button
                    key={optIdx}
                    id={`soal-mcma-${activeNo}-opt-${optIdx}`}
                    disabled={isCurrentSubmitted}
                    onClick={() => handleToggleMcma(optIdx)}
                    className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm transition-all flex items-start gap-3 ${optionStyle}`}
                  >
                    <span className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5 border ${
                      isSelected
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-slate-100 text-slate-700 border-slate-300'
                    }`}>
                      {isSelected ? <Check size={14} /> : String.fromCharCode(65 + optIdx)}
                    </span>
                    <span className="flex-1 leading-snug">{opsiText}</span>
                    {isCurrentSubmitted && isKey && (
                      <CheckCircle2 size={16} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {/* -----------------------------------------------------------
              3. TIPE 'jodoh' (Menjodohkan Pasangan Konsep)
          ----------------------------------------------------------- */}
          {currentSoal.t === 'jodoh' && currentSoal.pasanganJodoh && (
            <div className="space-y-4 mb-6">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2.5">
                {currentSoal.pasanganJodoh.map((p, pIdx) => (
                  <div
                    key={pIdx}
                    className="p-3 bg-white rounded-lg border border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
                  >
                    <span className="font-bold text-xs sm:text-sm text-indigo-900">
                      {p.kiri}
                    </span>
                    <span className="hidden sm:inline text-slate-400">➔</span>
                    <span className="text-xs sm:text-sm text-slate-700 sm:text-right">
                      {p.kanan}
                    </span>
                  </div>
                ))}
              </div>

              <div className="bg-white p-4 rounded-xl border border-slate-200">
                <span className="text-xs font-bold text-slate-700 block mb-2">
                  Apakah pasangan konsep di atas telah bersesuaian dengan teori sosiologis?
                </span>
                <div className="flex gap-3">
                  <button
                    disabled={isCurrentSubmitted}
                    onClick={() => handleSelectJodoh(1)}
                    className={`flex-1 py-2.5 rounded-lg border text-xs sm:text-sm font-bold transition ${
                      currentAnswer === 1
                        ? 'bg-indigo-600 text-white border-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Ya, Pasangan Sesuai
                  </button>
                  <button
                    disabled={isCurrentSubmitted}
                    onClick={() => handleSelectJodoh(0)}
                    className={`flex-1 py-2.5 rounded-lg border text-xs sm:text-sm font-bold transition ${
                      currentAnswer === 0
                        ? 'bg-indigo-600 text-white border-indigo-700'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    Belum Sesuai
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* -----------------------------------------------------------
              4. TIPE 'drag_word' (Mengisi Rumpang Kalimat)
          ----------------------------------------------------------- */}
          {currentSoal.t === 'drag_word' && currentSoal.kataPilihan && (
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-indigo-50/50 rounded-xl border border-indigo-200 leading-relaxed text-xs sm:text-sm text-slate-800 font-medium">
                Kelompok{' '}
                <span className="px-2.5 py-1 bg-white border border-indigo-400 rounded-md font-bold text-indigo-700 underline mx-1">
                  {(Array.isArray(currentAnswer) && currentAnswer[0]) || '______ (1)'}
                </span>{' '}
                ditandai oleh pergaulan dan kerja sama{' '}
                <span className="px-2.5 py-1 bg-white border border-indigo-400 rounded-md font-bold text-indigo-700 underline mx-1">
                  {(Array.isArray(currentAnswer) && currentAnswer[1]) || '______ (2)'}
                </span>{' '}
                yang bersifat mendalam, langgeng, dan tatap muka secara langsung, seperti yang ditemukan pada lingkungan{' '}
                <span className="px-2.5 py-1 bg-white border border-indigo-400 rounded-md font-bold text-indigo-700 underline mx-1">
                  {(Array.isArray(currentAnswer) && currentAnswer[2]) || '______ (3)'}
                </span>.
              </div>

              {!isCurrentSubmitted && (
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Bank Kata Pilihan (Klik untuk mengisi secara berurutan):
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {currentSoal.kataPilihan.map((word, wIdx) => {
                      const isUsed = Array.isArray(currentAnswer) && currentAnswer.includes(word);
                      return (
                        <button
                          key={wIdx}
                          disabled={isUsed}
                          onClick={() => handleAddDragWord(word)}
                          className={`px-3 py-1.5 rounded-lg border text-xs font-bold transition ${
                            isUsed
                              ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                              : 'bg-white text-slate-800 border-slate-300 hover:border-indigo-500 hover:bg-indigo-50/50 shadow-2xs'
                          }`}
                        >
                          + {word}
                        </button>
                      );
                    })}
                    <button
                      onClick={handleResetDragWords}
                      className="px-3 py-1.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-bold transition"
                    >
                      ↺ Reset Isian
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* In-depth Explanation Box (msg) */}
          {isCurrentSubmitted && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 sm:p-5 mb-6 text-xs sm:text-sm text-emerald-950 leading-relaxed animate-fade-in">
              <div className="flex items-center gap-1.5 font-black text-emerald-900 mb-1.5">
                <Lightbulb size={17} className="text-emerald-700" />
                <span>Pembahasan Lengkap & Refleksi Konseptual:</span>
              </div>
              <p className="text-slate-800">
                {currentSoal.msg}
              </p>
            </div>
          )}

          {/* Bottom Media Attached to Question (e.g. Pembahasan Gambar / Infografis / Tabel Analisis) */}
          <MediaDisplay mediaList={currentSoal.mediaList} posisiFilter="bawah" />

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-100">
            <button
              id="prev-soal-btn"
              disabled={activeNo === 0}
              onClick={() => {
                sound.playClick();
                setActiveNo(activeNo - 1);
              }}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border border-slate-200 text-xs sm:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-1"
            >
              <ChevronLeft size={16} /> Sebelumnya
            </button>

            {!isCurrentSubmitted ? (
              <button
                id="submit-soal-btn"
                onClick={handleSubmitSoal}
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold shadow-xs transition"
              >
                Kunci Jawaban & Tampilkan Pembahasan
              </button>
            ) : activeNo < activeList.length - 1 ? (
              <button
                id="next-soal-btn"
                onClick={() => {
                  sound.playClick();
                  setActiveNo(activeNo + 1);
                }}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1 shadow-xs"
              >
                Soal Berikutnya <ChevronRight size={16} />
              </button>
            ) : (
              <button
                id="show-rapor-btn"
                onClick={() => {
                  sound.playSuccess();
                  setShowRapor(true);
                }}
                className="w-full sm:w-auto px-6 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-xs"
              >
                <Award size={16} /> Lihat Rekap Nilai Evaluasi
              </button>
            )}
          </div>

        </div>
      )}

    </div>
  );
};
