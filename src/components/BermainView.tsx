import React, { useState, useEffect } from 'react';
import { dataBermain } from '../data/mpiData';
import { GameItem } from '../types';
import { sound } from '../utils/audio';
import { MediaDisplay } from './MediaDisplay';
import { getAnimationClasses } from '../utils/animationHelper';
import { getGameIconBadge } from '../utils/iconHelper';
import { 
  Trophy, 
  RotateCcw, 
  CheckCircle2, 
  ArrowUp, 
  ArrowDown, 
  Sparkles, 
  Flame, 
  ChevronRight,
  AlertCircle,
  ArrowRight,
  FileCheck2
} from 'lucide-react';

interface BermainViewProps {
  gameList?: GameItem[];
  onGameComplete?: (gameIdx: number) => void;
  isBermainCompleted?: boolean;
  onNavigateTab?: (tab: 'berlatih') => void;
}

export const BermainView: React.FC<BermainViewProps> = ({ 
  gameList,
  onGameComplete,
  isBermainCompleted = false,
  onNavigateTab
}) => {
  const activeGames = gameList && gameList.length > 0 ? gameList : dataBermain;
  const [activeGameIdx, setActiveGameIdx] = useState(0);
  const [completedGames, setCompletedGames] = useState<boolean[]>(
    new Array(activeGames.length).fill(false)
  );

  const safeIdx = Math.min(activeGameIdx, activeGames.length - 1);
  const currentGame: GameItem = activeGames[safeIdx] || activeGames[0];

  // --- STATE FOR GAME 1 & 6: JODOH ---
  const [jodohSelectedLeft, setJodohSelectedLeft] = useState<string | null>(null);
  const [jodohMatchedIds, setJodohMatchedIds] = useState<string[]>([]);
  const [shuffledRight, setShuffledRight] = useState<Array<{ id: string; kanan: string }>>([]);

  // --- STATE FOR GAME 2 & 7: KLIK ---
  const [clickedCards, setClickedCards] = useState<{ [key: number]: boolean }>({});

  // --- STATE FOR GAME 3 & 8: URUT ---
  const [currentUrutList, setCurrentUrutList] = useState<string[]>([]);
  const [urutChecked, setUrutChecked] = useState<boolean | null>(null);

  // --- STATE FOR GAME 4 & 9: KUMPUL ---
  const [collectedIndices, setCollectedIndices] = useState<number[]>([]);
  const [wrongCollectedIndices, setWrongCollectedIndices] = useState<number[]>([]);

  // --- STATE FOR GAME 5 & 10: SAMBUNG ---
  const [selectedSebabIdx, setSelectedSebabIdx] = useState<number | null>(null);
  const [sambungMatchedSebab, setSambungMatchedSebab] = useState<number[]>([]);
  const [sambungMatchedAkibat, setSambungMatchedAkibat] = useState<string[]>([]);
  const [shuffledAkibat, setShuffledAkibat] = useState<string[]>([]);

  // Initialize game state when switching active game
  useEffect(() => {
    resetCurrentGame();
  }, [activeGameIdx]);

  const resetCurrentGame = () => {
    const g = currentGame || activeGames[safeIdx] || dataBermain[0];
    if (!g) return;

    if (g.tipe === 'jodoh' && g.pasangan) {
      setJodohSelectedLeft(null);
      setJodohMatchedIds([]);
      const rightItems = g.pasangan.map(p => ({ id: p.id, kanan: p.kanan }));
      setShuffledRight([...rightItems].sort(() => Math.random() - 0.5));
    } else if (g.tipe === 'klik') {
      setClickedCards({});
    } else if (g.tipe === 'urut' && g.urutanBenar) {
      setUrutChecked(null);
      setCurrentUrutList([...g.urutanBenar].sort(() => Math.random() - 0.5));
    } else if (g.tipe === 'kumpul') {
      setCollectedIndices([]);
      setWrongCollectedIndices([]);
    } else if (g.tipe === 'sambung' && g.rantaiLogika) {
      setSelectedSebabIdx(null);
      setSambungMatchedSebab([]);
      setSambungMatchedAkibat([]);
      setShuffledAkibat(g.rantaiLogika.map(r => r.akibat).sort(() => Math.random() - 0.5));
    }
  };

  const markGameComplete = () => {
    sound.playFanfare();
    setCompletedGames(prev => {
      const next = [...prev];
      next[activeGameIdx] = true;
      return next;
    });
    onGameComplete?.(activeGameIdx);
  };

  // -------------------------------------------------------------
  // HANDLERS: JODOH
  // -------------------------------------------------------------
  const handleJodohLeft = (id: string) => {
    if (jodohMatchedIds.includes(id)) return;
    sound.playClick();
    setJodohSelectedLeft(id);
  };

  const handleJodohRight = (id: string) => {
    if (!jodohSelectedLeft || jodohMatchedIds.includes(id)) return;

    if (jodohSelectedLeft === id) {
      sound.playSuccess();
      const next = [...jodohMatchedIds, id];
      setJodohMatchedIds(next);
      setJodohSelectedLeft(null);

      if (currentGame.pasangan && next.length === currentGame.pasangan.length) {
        markGameComplete();
      }
    } else {
      sound.playError();
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: KLIK
  // -------------------------------------------------------------
  const handleKlikCard = (idx: number, isCorrect: boolean) => {
    if (clickedCards[idx] !== undefined) return;

    setClickedCards(prev => ({ ...prev, [idx]: true }));

    if (isCorrect) {
      sound.playSuccess();
    } else {
      sound.playError();
    }

    if (currentGame.itemKlik) {
      const correctIndices = currentGame.itemKlik
        .map((item, i) => (item.benar ? i : -1))
        .filter(i => i !== -1);

      const updated = { ...clickedCards, [idx]: true };
      const allFound = correctIndices.every(ci => updated[ci] === true);

      if (allFound) {
        markGameComplete();
      }
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: URUT
  // -------------------------------------------------------------
  const moveUrut = (idx: number, direction: number) => {
    sound.playClick();
    const targetIdx = idx + direction;
    if (targetIdx < 0 || targetIdx >= currentUrutList.length) return;

    const list = [...currentUrutList];
    const temp = list[idx];
    list[idx] = list[targetIdx];
    list[targetIdx] = temp;
    setCurrentUrutList(list);
    setUrutChecked(null);
  };

  const checkUrut = () => {
    if (!currentGame.urutanBenar) return;
    const isMatched = currentUrutList.every(
      (item, i) => item === currentGame.urutanBenar![i]
    );

    setUrutChecked(isMatched);
    if (isMatched) {
      markGameComplete();
    } else {
      sound.playError();
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: KUMPUL
  // -------------------------------------------------------------
  const handleKumpulItem = (idx: number, isCorrect: boolean) => {
    if (collectedIndices.includes(idx) || wrongCollectedIndices.includes(idx)) return;

    if (isCorrect) {
      sound.playSuccess();
      const next = [...collectedIndices, idx];
      setCollectedIndices(next);

      if (currentGame.itemKumpul) {
        const totalCorrect = currentGame.itemKumpul.filter(item => item.benar).length;
        if (next.length === totalCorrect) {
          markGameComplete();
        }
      }
    } else {
      sound.playError();
      setWrongCollectedIndices(prev => [...prev, idx]);
    }
  };

  // -------------------------------------------------------------
  // HANDLERS: SAMBUNG
  // -------------------------------------------------------------
  const handleSambungSebab = (idx: number) => {
    if (sambungMatchedSebab.includes(idx)) return;
    sound.playClick();
    setSelectedSebabIdx(idx);
  };

  const handleSambungAkibat = (akibatStr: string) => {
    if (selectedSebabIdx === null || sambungMatchedAkibat.includes(akibatStr)) return;
    if (!currentGame.rantaiLogika) return;

    const correctAkibat = currentGame.rantaiLogika[selectedSebabIdx].akibat;

    if (akibatStr === correctAkibat) {
      sound.playSuccess();
      const nextSebab = [...sambungMatchedSebab, selectedSebabIdx];
      const nextAkibat = [...sambungMatchedAkibat, akibatStr];
      setSambungMatchedSebab(nextSebab);
      setSambungMatchedAkibat(nextAkibat);
      setSelectedSebabIdx(null);

      if (nextSebab.length === currentGame.rantaiLogika.length) {
        markGameComplete();
      }
    } else {
      sound.playError();
    }
  };

  const totalDone = completedGames.filter(Boolean).length;
  const isCurrentDone = completedGames[activeGameIdx];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      
      {/* Top Level Game Picker: 1 to 10 with cycle info */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200 shadow-xs mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3 pb-2 border-b border-slate-100">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <Flame className="text-teal-600" size={20} />
              <span>Modul Bermain: 10 Aktivitas Interaktif Sosiologi</span>
            </h2>
            <p className="text-xs text-slate-500">
              Siklus tipe game: Jodoh ➔ Klik ➔ Urut ➔ Kumpul ➔ Sambung (Diulang 2 Siklus)
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-3 py-1 bg-teal-50 text-teal-700 border border-teal-200 rounded-full">
              Selesai: {totalDone} / {activeGames.length}
            </span>
          </div>
        </div>

        {/* 10 Game Navigation Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-2">
          {activeGames.map((g, idx) => {
            const isCurrent = idx === activeGameIdx;
            const isDone = completedGames[idx];
            const badge = getGameIconBadge(g, idx, 16);

            return (
              <button
                key={g.id}
                id={`game-select-btn-${g.id}`}
                onClick={() => {
                  sound.playClick();
                  setActiveGameIdx(idx);
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border transition-all text-center relative gap-1 ${
                  isCurrent
                    ? 'bg-teal-600 text-white border-teal-700 shadow-md ring-2 ring-teal-400/50'
                    : isDone
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {/* Engaging Icon */}
                <div className={`p-1.5 rounded-lg ${isCurrent ? 'bg-white/20 text-white' : badge.bgClass} transition`}>
                  {badge.icon}
                </div>

                <span className="text-[11px] font-black leading-tight">Game {idx + 1}</span>
                <span className={`text-[9px] font-bold uppercase tracking-wider ${
                  isCurrent ? 'text-teal-100' : isDone ? 'text-emerald-700' : 'text-slate-500'
                }`}>
                  {g.tipe}
                </span>
                {isDone && (
                  <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
                    ✓
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Game Stage Card */}
      {(() => {
        const animClasses = currentGame ? getAnimationClasses(currentGame.animasi) : '';
        const currentBadge = currentGame ? getGameIconBadge(currentGame, safeIdx, 22) : null;

        return (
          <div className={`bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-7 ${animClasses}`}>
            
            {/* Game Header with Icon */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 mb-5 border-b border-slate-100 gap-3">
              <div className="flex items-center gap-3">
                {currentBadge && (
                  <div className={`p-3 rounded-2xl shrink-0 ${currentBadge.bgClass} border ${currentBadge.borderClass}`}>
                    {currentBadge.icon}
                  </div>
                )}
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase bg-teal-100 text-teal-800 tracking-wider">
                      Aktivitas {activeGameIdx + 1} • {currentBadge?.label || currentGame.tipe}
                    </span>
                    {isCurrentDone && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        <CheckCircle2 size={13} /> Selesai Bintang ⭐
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-snug">
                    {currentGame.judul}
                  </h3>
                </div>
              </div>

              <button
                id="reset-current-game-btn"
                onClick={() => {
                  sound.playClick();
                  resetCurrentGame();
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 text-slate-700 hover:bg-slate-100 transition self-start sm:self-auto"
              >
                <RotateCcw size={14} />
                <span>Reset Game</span>
              </button>
            </div>

            {/* Media Display Bagian Atas */}
            <MediaDisplay mediaList={currentGame.mediaList} posisiFilter="atas" />

            {/* Game Instruction */}
            <div className="bg-slate-50 border-l-4 border-teal-600 p-3.5 rounded-r-lg mb-6 text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
              {currentGame.instruksi}
            </div>

        {/* -------------------------------------------------------------
            ENGINE 1 & 6: TIPE JODOH
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'jodoh' && currentGame.pasangan && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Kolom Kiri: Konsep / Tokoh */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Kolom 1: Konsep / Tokoh
                </span>
                {currentGame.pasangan.map(p => {
                  const isMatched = jodohMatchedIds.includes(p.id);
                  const isSelected = jodohSelectedLeft === p.id;
                  return (
                    <button
                      key={p.id}
                      id={`jodoh-left-${p.id}`}
                      disabled={isMatched}
                      onClick={() => handleJodohLeft(p.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 cursor-default opacity-85'
                          : isSelected
                          ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{p.kiri}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Kolom Kanan: Pasangan Konsep */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Kolom 2: Definisi / Konsep Pasangan
                </span>
                {shuffledRight.map(p => {
                  const isMatched = jodohMatchedIds.includes(p.id);
                  return (
                    <button
                      key={p.id}
                      id={`jodoh-right-${p.id}`}
                      disabled={isMatched || !jodohSelectedLeft}
                      onClick={() => handleJodohRight(p.id)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 cursor-default opacity-85'
                          : jodohSelectedLeft
                          ? 'bg-white border-teal-300 hover:bg-teal-50/70 hover:border-teal-500 text-slate-800 cursor-pointer shadow-xs'
                          : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{p.kanan}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Instruction Cue */}
            <div className="text-center text-xs text-slate-500 mt-2">
              {jodohSelectedLeft ? (
                <span className="text-teal-700 font-bold">
                  👉 Sekarang klik pasangan yang cocok di kolom sebelah kanan!
                </span>
              ) : (
                <span>Klik salah satu item di kolom sebelah kiri terlebih dahulu.</span>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 2 & 7: TIPE KLIK
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'klik' && currentGame.itemKlik && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {currentGame.itemKlik.map((item, idx) => {
                const wasClicked = clickedCards[idx] !== undefined;
                let cardStyle = 'bg-white border-slate-200 hover:border-teal-400 hover:bg-teal-50/40 text-slate-800';

                if (wasClicked) {
                  if (item.benar) {
                    cardStyle = 'bg-emerald-50 border-emerald-400 text-emerald-900 font-bold shadow-xs';
                  } else {
                    cardStyle = 'bg-rose-50 border-rose-300 text-rose-900 opacity-70';
                  }
                }

                return (
                  <button
                    key={idx}
                    id={`klik-item-${idx}`}
                    disabled={wasClicked}
                    onClick={() => handleKlikCard(idx, item.benar)}
                    className={`p-4 rounded-xl border text-xs sm:text-sm font-semibold text-center transition-all flex flex-col items-center justify-center min-h-[90px] gap-2 ${cardStyle}`}
                  >
                    <span>{item.teks}</span>
                    {wasClicked && (
                      <span className="text-xs">
                        {item.benar ? '✅ Tepat' : '❌ Pengecoh'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="text-xs text-slate-500 text-center">
              Target: Temukan semua item yang sesuai dengan kriteria yang diinstruksikan.
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 3 & 8: TIPE URUT
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'urut' && (
          <div className="space-y-4">
            <div className="space-y-2 max-w-2xl mx-auto">
              {currentUrutList.map((teks, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl"
                >
                  <div className="flex flex-col gap-1">
                    <button
                      id={`urut-up-${idx}`}
                      disabled={idx === 0}
                      onClick={() => moveUrut(idx, -1)}
                      className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button
                      id={`urut-down-${idx}`}
                      disabled={idx === currentUrutList.length - 1}
                      onClick={() => moveUrut(idx, 1)}
                      className="w-7 h-7 rounded bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div className="w-7 h-7 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs flex items-center justify-center flex-shrink-0">
                    {idx + 1}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-slate-800 flex-1">
                    {teks}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
              <button
                id="check-urut-btn"
                onClick={checkUrut}
                className="px-6 py-2.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs sm:text-sm font-bold shadow-xs transition"
              >
                Periksa Urutan
              </button>

              {urutChecked !== null && (
                <div className={`text-xs sm:text-sm font-bold flex items-center gap-1.5 ${
                  urutChecked ? 'text-emerald-600' : 'text-rose-600'
                }`}>
                  {urutChecked ? (
                    <>
                      <CheckCircle2 size={16} />
                      <span>Urutan Tepat & Sempurna!</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle size={16} />
                      <span>Urutan belum tepat. Gunakan tombol panah untuk memindahkannya!</span>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 4 & 9: TIPE KUMPUL
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'kumpul' && currentGame.itemKumpul && (
          <div className="space-y-5">
            <div className="flex flex-wrap gap-2.5 justify-center">
              {currentGame.itemKumpul.map((item, idx) => {
                const isCollected = collectedIndices.includes(idx);
                const isWrong = wrongCollectedIndices.includes(idx);

                return (
                  <button
                    key={idx}
                    id={`kumpul-item-${idx}`}
                    disabled={isCollected || isWrong}
                    onClick={() => handleKumpulItem(idx, item.benar)}
                    className={`px-4 py-2.5 rounded-full border text-xs sm:text-sm font-semibold transition-all ${
                      isCollected
                        ? 'bg-emerald-100 border-emerald-500 text-emerald-900 shadow-xs'
                        : isWrong
                        ? 'bg-rose-100 border-rose-300 text-rose-900 opacity-60 line-through'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-teal-500 hover:bg-teal-50/50 shadow-2xs'
                    }`}
                  >
                    {isCollected ? `✓ ${item.teks}` : item.teks}
                  </button>
                );
              })}
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-center max-w-md mx-auto">
              <span className="text-xs font-bold text-slate-500 block mb-1">
                Koleksi yang Terkumpul:
              </span>
              <span className="text-sm font-extrabold text-teal-700">
                {collectedIndices.length} dari {currentGame.itemKumpul.filter(i => i.benar).length} Karakteristik
              </span>
            </div>
          </div>
        )}

        {/* -------------------------------------------------------------
            ENGINE 5 & 10: TIPE SAMBUNG
        ------------------------------------------------------------- */}
        {currentGame.tipe === 'sambung' && currentGame.rantaiLogika && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* Sebab / Aksi */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Sebab / Tindakan Sosiologis
                </span>
                {currentGame.rantaiLogika.map((item, idx) => {
                  const isMatched = sambungMatchedSebab.includes(idx);
                  const isSelected = selectedSebabIdx === idx;

                  return (
                    <button
                      key={idx}
                      id={`sambung-sebab-${idx}`}
                      disabled={isMatched}
                      onClick={() => handleSambungSebab(idx)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 cursor-default'
                          : isSelected
                          ? 'bg-teal-50 border-teal-600 text-teal-950 font-bold ring-2 ring-teal-400/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{item.sebab}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Akibat / Dampak */}
              <div className="space-y-2.5">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
                  Akibat / Dampak Logis
                </span>
                {shuffledAkibat.map((akibatStr, idx) => {
                  const isMatched = sambungMatchedAkibat.includes(akibatStr);

                  return (
                    <button
                      key={idx}
                      id={`sambung-akibat-${idx}`}
                      disabled={isMatched || selectedSebabIdx === null}
                      onClick={() => handleSambungAkibat(akibatStr)}
                      className={`w-full text-left p-3.5 rounded-xl border text-xs sm:text-sm font-semibold transition-all ${
                        isMatched
                          ? 'bg-emerald-50 border-emerald-400 text-emerald-800 cursor-default'
                          : selectedSebabIdx !== null
                          ? 'bg-white border-teal-300 hover:bg-teal-50/70 hover:border-teal-500 text-slate-800 cursor-pointer'
                          : 'bg-slate-50 border-slate-200 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span>{akibatStr}</span>
                        {isMatched && <CheckCircle2 size={16} className="text-emerald-600" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="text-center text-xs text-slate-500 mt-2">
              {selectedSebabIdx !== null ? (
                <span className="text-teal-700 font-bold">
                  👉 Sekarang klik akibat yang timbul di kolom sebelah kanan!
                </span>
              ) : (
                <span>Klik sebab di sebelah kiri terlebih dahulu untuk menghubungkannya.</span>
              )}
            </div>
          </div>
        )}

            {/* Media Display Bagian Bawah */}
            <MediaDisplay mediaList={currentGame.mediaList} posisiFilter="bawah" />

            {/* Bottom Game Nav Step */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-6 mt-6 border-t border-slate-100">
              <button
                type="button"
                id="prev-game-btn"
                disabled={activeGameIdx === 0}
                onClick={() => {
                  sound.playClick();
                  setActiveGameIdx(activeGameIdx - 1);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-35 disabled:cursor-not-allowed transition flex items-center justify-center gap-2 shadow-2xs"
              >
                <span>← Game Sebelumnya</span>
                {activeGameIdx > 0 && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 text-slate-700">
                    G{activeGameIdx}
                  </span>
                )}
              </button>

              <div className="text-xs font-bold text-slate-500 hidden md:block">
                Game {activeGameIdx + 1} dari {activeGames.length}
              </div>

              {activeGameIdx < activeGames.length - 1 ? (
                <button
                  type="button"
                  id="next-game-btn"
                  onClick={() => {
                    sound.playClick();
                    setActiveGameIdx(activeGameIdx + 1);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-teal-600 text-white text-xs sm:text-sm font-black hover:bg-teal-700 flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span>Game Selanjutnya →</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-800/60 text-teal-100">
                    G{activeGameIdx + 2}
                  </span>
                </button>
              ) : (
                <button
                  type="button"
                  id="next-game-to-berlatih-btn"
                  onClick={() => {
                    sound.playClick();
                    onNavigateTab?.('berlatih');
                  }}
                  className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-indigo-600 text-white text-xs sm:text-sm font-black hover:bg-indigo-700 flex items-center justify-center gap-2 shadow-md transition"
                >
                  <span>🏆 Game Terakhir: Lanjut ke Modul Berlatih →</span>
                </button>
              )}
            </div>

            {/* Banner saat Modul Bermain telah diselesaikan dan Modul Berlatih Terbuka */}
            {(isBermainCompleted || completedGames.some(Boolean)) && (
              <div className="mt-6 p-5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-700 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
                    🎯
                  </div>
                  <div>
                    <h3 className="text-base font-black">
                      Prasyarat Modul Berlatih Terpenuhi!
                    </h3>
                    <p className="text-xs text-purple-100 mt-0.5">
                      Anda telah menuntaskan aktivitas bermain. Kini <strong>Modul Berlatih (Evaluasi 20 Soal)</strong> telah terbuka.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  id="btn-goto-berlatih-from-bermain"
                  onClick={() => {
                    sound.playClick();
                    onNavigateTab?.('berlatih');
                  }}
                  className="px-5 py-2.5 rounded-xl bg-white text-indigo-950 font-black text-xs sm:text-sm shadow-md hover:bg-purple-50 transition shrink-0 flex items-center gap-2"
                >
                  <FileCheck2 size={17} className="text-indigo-600" />
                  <span>Lanjut ke Modul Berlatih →</span>
                </button>
              </div>
            )}

          </div>
        );
      })()}

    </div>
  );
};
