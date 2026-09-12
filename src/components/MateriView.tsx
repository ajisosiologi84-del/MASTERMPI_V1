import React, { useState } from 'react';
import { MATERI } from '../data/mpiData';
import { MateriItem } from '../types';
import { sound } from '../utils/audio';
import { MediaDisplay } from './MediaDisplay';
import { getAnimationClasses } from '../utils/animationHelper';
import { getMateriIconBadge } from '../utils/iconHelper';
import { 
  BookOpen, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  HelpCircle, 
  Lightbulb, 
  Lock, 
  RotateCcw, 
  AlertTriangle, 
  Sparkles,
  Gamepad2,
  ChevronLeft
} from 'lucide-react';

interface MateriViewProps {
  materiList?: MateriItem[];
  completedBabIds?: number[];
  onBabComplete?: (babId: number) => void;
  isMateriCompleted?: boolean;
  onNavigateTab?: (tab: 'bermain' | 'berlatih') => void;
}

export const MateriView: React.FC<MateriViewProps> = ({ 
  materiList,
  completedBabIds = [],
  onBabComplete,
  isMateriCompleted = false,
  onNavigateTab
}) => {
  const activeMateri = materiList && materiList.length > 0 ? materiList : MATERI;
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [miniQuizAnswers, setMiniQuizAnswers] = useState<{ [key: number]: number | null }>({});
  const [miniQuizFeedback, setMiniQuizFeedback] = useState<{ [key: number]: boolean }>({});
  const [lockedNotice, setLockedNotice] = useState<string | null>(null);

  const safeIdx = Math.min(selectedIdx, activeMateri.length - 1);
  const currentMateri = activeMateri[safeIdx] || activeMateri[0];

  // Helper: check if a bab is unlocked based on previous bab completion
  const isBabUnlocked = (idx: number): boolean => {
    if (idx === 0) return true;
    const prevBab = activeMateri[idx - 1];
    return completedBabIds.includes(prevBab.id);
  };

  const handleSelectMateri = (idx: number) => {
    if (!isBabUnlocked(idx)) {
      sound.playError();
      setLockedNotice(`Bab ${idx + 1} masih terkunci! Sesuai aturan MPI, selesaikan kuis refleksi pada Bab ${idx} dengan benar terlebih dahulu.`);
      setTimeout(() => setLockedNotice(null), 4000);
      return;
    }
    sound.playClick();
    setLockedNotice(null);
    setSelectedIdx(idx);
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  const handleMiniQuizOption = (materiId: number, optionIdx: number) => {
    sound.playClick();
    setMiniQuizAnswers(prev => ({ ...prev, [materiId]: optionIdx }));
    setMiniQuizFeedback(prev => ({ ...prev, [materiId]: true }));
    
    const isCorrect = optionIdx === currentMateri.kuisMini.kunci;
    
    if (isCorrect) {
      sound.playSuccess();
      onBabComplete?.(materiId);
    } else {
      sound.playError();
    }
  };

  // Rule: Return to previous bab when quiz answer is incorrect
  const handleReturnToPrevBab = () => {
    sound.playClick();
    // Reset the wrong answer for current bab so student can retry upon returning
    setMiniQuizAnswers(prev => ({ ...prev, [currentMateri.id]: null }));
    setMiniQuizFeedback(prev => ({ ...prev, [currentMateri.id]: false }));
    setSelectedIdx(prev => Math.max(0, prev - 1));
    window.scrollTo({ top: 120, behavior: 'smooth' });
  };

  // Rule: Reset Bab 1 quiz if wrong
  const handleRetryCurrentBab = () => {
    sound.playClick();
    setMiniQuizAnswers(prev => ({ ...prev, [currentMateri.id]: null }));
    setMiniQuizFeedback(prev => ({ ...prev, [currentMateri.id]: false }));
    window.scrollTo({ top: 200, behavior: 'smooth' });
  };

  const currentAnswer = miniQuizAnswers[currentMateri.id];
  const isAnswered = currentAnswer !== undefined && currentAnswer !== null;
  const isCurrentBabPassed = completedBabIds.includes(currentMateri.id);
  const isCorrect = isAnswered && currentAnswer === currentMateri.kuisMini.kunci;
  const animClasses = currentMateri ? getAnimationClasses(currentMateri.animasi) : '';
  const currentBadge = currentMateri ? getMateriIconBadge(currentMateri, safeIdx, 24) : null;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Toast Notice when attempting to access locked bab */}
      {lockedNotice && (
        <div className="mb-5 p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-900 flex items-center justify-between gap-3 shadow-md animate-bounce-in">
          <div className="flex items-center gap-2.5 text-xs sm:text-sm font-bold">
            <Lock className="text-amber-600 shrink-0" size={18} />
            <span>{lockedNotice}</span>
          </div>
          <button 
            onClick={() => setLockedNotice(null)}
            className="text-xs font-black text-amber-800 hover:text-amber-950 px-2 py-1 rounded-md"
          >
            Tutup
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Sidebar Nav: Sub-Materi Chapters */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs">
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <BookOpen className="text-blue-600" size={18} />
                <h2 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                  Daftar Sub-Materi ({activeMateri.length} Bab)
                </h2>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {completedBabIds.length}/{activeMateri.length} Lolos
              </span>
            </div>

            <div className="space-y-2.5">
              {activeMateri.map((item, idx) => {
                const isCurrent = idx === selectedIdx;
                const isPassed = completedBabIds.includes(item.id);
                const isUnlocked = isBabUnlocked(idx);
                const badge = getMateriIconBadge(item, idx, 18);

                return (
                  <button
                    key={item.id}
                    id={`materi-item-btn-${item.id}`}
                    onClick={() => handleSelectMateri(idx)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all flex items-start gap-3 relative ${
                      isCurrent
                        ? 'bg-blue-50/95 border-blue-500 shadow-sm ring-2 ring-blue-400/20'
                        : isUnlocked
                        ? 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
                        : 'bg-slate-50/80 border-slate-200 text-slate-400 opacity-60 cursor-not-allowed'
                    }`}
                  >
                    <div className={`p-2 rounded-xl shrink-0 ${isUnlocked ? badge.bgClass : 'bg-slate-200 text-slate-400'} border ${isUnlocked ? badge.borderClass : 'border-slate-300'}`}>
                      {isUnlocked ? badge.icon : <Lock size={16} className="text-slate-400" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-0.5">
                        <span className={`text-[10px] font-black px-1.5 py-0.2 rounded ${
                          isCurrent 
                            ? 'bg-blue-600 text-white' 
                            : isUnlocked 
                            ? 'bg-slate-100 text-slate-700' 
                            : 'bg-slate-200 text-slate-500'
                        }`}>
                          Bab {idx + 1}
                        </span>

                        {isPassed ? (
                          <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 size={12} /> Lolos Kuis
                          </span>
                        ) : !isUnlocked ? (
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                            <Lock size={11} /> Terkunci
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold text-amber-600">
                            Wajib Kuis
                          </span>
                        )}
                      </div>
                      <div className={`text-xs font-bold leading-snug line-clamp-2 ${
                        isCurrent ? 'text-blue-950 font-black' : isUnlocked ? 'text-slate-700' : 'text-slate-400'
                      }`}>
                        {item.judul}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box & MPI Rules */}
          <div className="bg-gradient-to-br from-slate-900 to-blue-950 text-white rounded-2xl p-4 shadow-xs border border-slate-800">
            <div className="flex items-center gap-2 text-amber-300 font-black text-xs uppercase mb-1.5">
              <Sparkles size={16} /> Aturan Checkpoint MPI
            </div>
            <p className="text-xs text-blue-100 leading-relaxed mb-2">
              Setiap bab wajib diselesaikan dengan menjawab <strong>Kuis Mini Refleksi</strong> dengan benar.
            </p>
            <div className="p-2 rounded-xl bg-white/10 text-[11px] text-slate-200 border border-white/10 space-y-1">
              <div className="flex items-start gap-1.5">
                <span className="text-emerald-400 font-bold">✓</span>
                <span>Jika jawaban <strong>Benar</strong>: Bab selanjutnya akan otomatis terbuka.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-rose-400 font-bold">✗</span>
                <span>Jika jawaban <strong>Salah</strong>: Klik tombol kembali ke Bab Sebelumnya untuk belajar ulang.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Area: Selected Sub-Materi */}
        <div className="lg:col-span-8 space-y-6">
          <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-6 md:p-8 ${animClasses}`}>
            
            {/* Header with Colorful Icon */}
            <div className="border-b border-slate-100 pb-5 mb-5 flex items-start gap-4">
              {currentBadge && (
                <div className={`p-3.5 rounded-2xl shrink-0 ${currentBadge.bgClass} border ${currentBadge.borderClass}`}>
                  {currentBadge.icon}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${currentBadge?.bgClass} border ${currentBadge?.borderClass}`}>
                    {currentMateri.kategori}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    Bab {selectedIdx + 1} dari {activeMateri.length}
                  </span>
                  {isCurrentBabPassed && (
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 size={13} /> Selesai
                    </span>
                  )}
                </div>
                <h2 className="text-xl md:text-2xl font-black text-slate-900 leading-tight">
                  {currentMateri.judul}
                </h2>
              </div>
            </div>

            {/* Media Display Bagian Atas */}
            <MediaDisplay mediaList={currentMateri.mediaList} posisiFilter="atas" />

            {/* Summary Highlight */}
            <div className="bg-blue-50/70 border-l-4 border-blue-600 p-4 rounded-r-lg mb-6">
              <div className="text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
                Ringkasan Inti Teori
              </div>
              <p className="text-sm md:text-base text-slate-800 font-medium leading-relaxed">
                {currentMateri.ringkasan}
              </p>
            </div>

            {/* Key Points */}
            <div className="mb-6">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center gap-2">
                <CheckCircle2 size={16} className="text-emerald-600" /> Poin Kunci Kurikulum
              </h3>
              <ul className="space-y-2">
                {currentMateri.poinKunci.map((point, pIdx) => (
                  <li key={pIdx} className="text-sm text-slate-700 flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-2 flex-shrink-0" />
                    <span className="leading-relaxed">{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* In-depth Narrative */}
            <div className="space-y-3 mb-6 text-sm text-slate-700 leading-relaxed border-t border-slate-100 pt-5">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2">
                Uraian Konsep Sosiologis
              </h3>
              {currentMateri.penjelasanLengkap.map((par, parIdx) => (
                <p key={parIdx} className="text-slate-600 text-justify">
                  {par}
                </p>
              ))}
            </div>

            {/* Contextual Case Study */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 md:p-5 mb-6">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-sm mb-1.5">
                <BookOpen size={16} className="text-blue-600" />
                <span>{currentMateri.studiKasus.judul}</span>
              </div>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">
                {currentMateri.studiKasus.deskripsi}
              </p>
            </div>

            {/* Kuis Mini Refleksi Cepat (Checkpoint Siswa Wajib) */}
            <div className="bg-amber-50/70 border-2 border-amber-300/80 rounded-2xl p-5 md:p-6 shadow-xs relative overflow-hidden">
              <div className="flex items-center justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 text-amber-900 font-black text-sm sm:text-base">
                  <HelpCircle size={20} className="text-amber-600" />
                  <span>Kuis Mini Refleksi Cepat (Checkpoint Bab {selectedIdx + 1})</span>
                </div>
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900 border border-amber-400/40">
                  Wajib Lolos
                </span>
              </div>

              <p className="text-xs text-slate-600 mb-3">
                Jawablah pertanyaan refleksi di bawah ini dengan benar untuk membuka bab berikutnya. Jika salah, Anda harus kembali ke bab sebelumnya.
              </p>

              <p className="text-sm md:text-base text-slate-900 font-bold mb-4 bg-white/80 p-3 rounded-xl border border-amber-200">
                {currentMateri.kuisMini.tanya}
              </p>

              <div className="space-y-2.5">
                {currentMateri.kuisMini.opsi.map((opsi, oIdx) => {
                  const isSelected = currentAnswer === oIdx;
                  let btnStyle = 'bg-white border-slate-200 hover:border-amber-400 hover:bg-amber-50/50 text-slate-700';

                  if (isAnswered) {
                    if (oIdx === currentMateri.kuisMini.kunci) {
                      btnStyle = 'bg-emerald-100 border-emerald-500 text-emerald-950 font-bold shadow-xs';
                    } else if (isSelected) {
                      btnStyle = 'bg-rose-100 border-rose-400 text-rose-950 font-medium';
                    } else {
                      btnStyle = 'bg-white/60 border-slate-200 text-slate-400 opacity-60';
                    }
                  }

                  return (
                    <button
                      key={oIdx}
                      id={`mini-quiz-${currentMateri.id}-opt-${oIdx}`}
                      disabled={isAnswered && isCorrect}
                      onClick={() => handleMiniQuizOption(currentMateri.id, oIdx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs md:text-sm transition-all flex items-start gap-3 ${btnStyle}`}
                    >
                      <span className="w-5 h-5 rounded-full flex items-center justify-center font-bold text-xs bg-slate-100 border border-slate-300 flex-shrink-0 mt-0.5">
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="flex-1 leading-snug">{opsi}</span>
                      {isAnswered && oIdx === currentMateri.kuisMini.kunci && (
                        <CheckCircle2 size={18} className="text-emerald-600 flex-shrink-0 mt-0.5" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <XCircle size={18} className="text-rose-600 flex-shrink-0 mt-0.5" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Feedback Display with Return to Previous Chapter Rule */}
              {isAnswered && (
                <div className={`mt-5 p-4 rounded-xl text-xs md:text-sm border transition-all ${
                  isCorrect
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                    : 'bg-rose-50 border-rose-300 text-rose-950'
                }`}>
                  <div className="font-black mb-1.5 flex items-center gap-2 text-sm">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 size={18} className="text-emerald-600" />
                        <span>Jawaban Anda Tepat! Checkpoint Selesai</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle size={18} className="text-rose-600" />
                        <span>Jawaban Belum Tepat! (Perlu Belajar Ulang)</span>
                      </>
                    )}
                  </div>

                  <p className="leading-relaxed text-slate-700 mb-2">
                    {currentMateri.kuisMini.penjelasan}
                  </p>

                  {/* Sesuai aturan: jika masih salah, sediakan tombol kembali ke Bab Sebelumnya */}
                  {!isCorrect && (
                    <div className="mt-3 pt-3 border-t border-rose-200 flex flex-wrap items-center gap-3">
                      {selectedIdx > 0 ? (
                        <button
                          type="button"
                          id="btn-return-prev-bab"
                          onClick={handleReturnToPrevBab}
                          className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                        >
                          <ChevronLeft size={16} />
                          <span>Kembali ke BAB Sebelumnya (Bab {selectedIdx})</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          id="btn-retry-bab-1"
                          onClick={handleRetryCurrentBab}
                          className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black text-xs shadow-md transition flex items-center gap-2"
                        >
                          <RotateCcw size={16} />
                          <span>Pelajari Ulang Bab 1 & Coba Lagi</span>
                        </button>
                      )}
                      <span className="text-[11px] text-rose-800 font-semibold">
                        ⚠️ Pelajari kembali konsepnya agar dapat menjawab dengan tepat.
                      </span>
                    </div>
                  )}

                  {isCorrect && selectedIdx < activeMateri.length - 1 && (
                    <div className="mt-2 text-emerald-800 font-bold text-xs flex items-center gap-1.5">
                      <Sparkles size={14} className="text-emerald-600" />
                      <span>Hebat! Bab {selectedIdx + 2} kini telah terbuka untuk dipelajari.</span>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Media Display Bagian Bawah */}
            <MediaDisplay mediaList={currentMateri.mediaList} posisiFilter="bawah" />

            {/* Bottom Nav Next/Prev with Locked State enforcement */}
            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5 mt-6">
              <button
                id="prev-materi-btn"
                disabled={selectedIdx === 0}
                onClick={() => handleSelectMateri(selectedIdx - 1)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs md:text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-1.5"
              >
                <ChevronLeft size={16} />
                <span>Sub-Materi Sebelumnya</span>
              </button>

              {selectedIdx < activeMateri.length - 1 ? (
                isCurrentBabPassed ? (
                  <button
                    id="next-materi-btn"
                    onClick={() => handleSelectMateri(selectedIdx + 1)}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 text-white text-xs md:text-sm font-extrabold hover:bg-blue-700 flex items-center gap-2 shadow-md hover:shadow-lg transition"
                  >
                    <span>Sub-Materi Selanjutnya</span>
                    <ArrowRight size={16} />
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-4 py-2.5 rounded-xl bg-slate-100 border border-slate-200 text-slate-400 text-xs md:text-sm font-bold flex items-center gap-2 cursor-not-allowed"
                    title="Jawab kuis mini refleksi dengan benar untuk lanjut ke bab berikutnya"
                  >
                    <Lock size={15} className="text-slate-400" />
                    <span>Loloskan Kuis Bab Ini untuk Lanjut</span>
                  </button>
                )
              ) : isMateriCompleted ? (
                <button
                  type="button"
                  id="btn-all-materi-done-next"
                  onClick={() => onNavigateTab?.('bermain')}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-black text-xs md:text-sm shadow-md hover:shadow-lg transition flex items-center gap-2"
                >
                  <Gamepad2 size={17} />
                  <span>Lanjut ke Modul Bermain →</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200">
                  ⚠️ Selesaikan kuis bab ini untuk membuka Modul Bermain
                </span>
              )}
            </div>

            {/* Celebration Banner when all materi completed */}
            {isMateriCompleted && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                    🎉
                  </div>
                  <div>
                    <h3 className="text-base font-black">
                      Seluruh Modul Materi Selesai!
                    </h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      Prasyarat terpenuhi! Pintu gerbang <strong>Modul Bermain (10 Game Interaktif)</strong> kini telah terbuka.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onNavigateTab?.('bermain')}
                  className="px-5 py-2.5 rounded-xl bg-white text-emerald-950 font-black text-xs sm:text-sm shadow-md hover:bg-emerald-50 transition shrink-0 flex items-center gap-2"
                >
                  <Gamepad2 size={16} className="text-teal-700" />
                  <span>Mulai Modul Bermain →</span>
                </button>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
