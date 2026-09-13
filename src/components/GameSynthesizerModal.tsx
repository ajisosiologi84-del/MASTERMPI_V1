import React, { useState } from 'react';
import { GameItem, SoalLatih, MpiConfig } from '../types';
import { generateGamesFromSoal } from '../utils/gameSynthesizer';
import { getGameIconBadge } from '../utils/iconHelper';
import { sound } from '../utils/audio';
import { 
  Sparkles, 
  X, 
  CheckCircle2, 
  Gamepad2, 
  Clock, 
  ArrowRight,
  Layers, 
  Eye,
  Flame,
  Check,
  Shuffle
} from 'lucide-react';

interface GameSynthesizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  soalList: SoalLatih[];
  config?: MpiConfig;
  onApplyGames: (generatedGames: GameItem[], replaceAll: boolean) => void;
}

export const GameSynthesizerModal: React.FC<GameSynthesizerModalProps> = ({
  isOpen,
  onClose,
  soalList,
  config,
  onApplyGames
}) => {
  const [activePreviewIdx, setActivePreviewIdx] = useState(0);
  const [replaceAll, setReplaceAll] = useState(true);

  if (!isOpen) return null;

  const generated = generateGamesFromSoal(soalList, config);
  const currentGame = generated[activePreviewIdx] || generated[0];
  const iconBadge = currentGame ? getGameIconBadge(currentGame, activePreviewIdx, 20) : null;

  const handleApply = () => {
    sound.playSuccess();
    onApplyGames(generated, replaceAll);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-scale-up">
        
        {/* Header Modal */}
        <div className="p-6 bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 text-slate-950 flex items-center justify-center shadow-lg font-black shrink-0">
              <Gamepad2 size={26} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30">
                  Otomasi Game Interaktif
                </span>
                <span className="text-xs text-purple-200">
                  Disintesis dari {soalList.length} Butir Soal Asesmen
                </span>
              </div>
              <h2 className="text-xl font-black text-white tracking-tight mt-0.5">
                Penyusun Otomatis Aktivitas Game (5 Modul Gamifikasi)
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onClose();
            }}
            className="p-2 text-slate-400 hover:text-white rounded-xl hover:bg-white/10 transition"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body: Two Columns */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12">
          
          {/* Left: 5 Game Selector */}
          <div className="md:col-span-4 bg-slate-50 p-4 border-r border-slate-200 overflow-y-auto space-y-2">
            <div className="text-[11px] font-extrabold uppercase text-slate-500 tracking-wider mb-2 px-1">
              Pratinjau 5 Game Hasil Sintesis:
            </div>

            {generated.map((g, idx) => {
              const isSelected = idx === activePreviewIdx;
              const badge = getGameIconBadge(g, idx, 16);

              return (
                <div
                  key={g.id || idx}
                  onClick={() => {
                    sound.playClick();
                    setActivePreviewIdx(idx);
                  }}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-2.5 ${
                    isSelected
                      ? 'bg-white border-purple-500 shadow-md ring-2 ring-purple-400/20'
                      : 'bg-white/60 border-slate-200 hover:border-slate-300 hover:bg-white'
                  }`}
                >
                  <div className={`p-2 rounded-xl shrink-0 ${badge.bgClass} border ${badge.borderClass}`}>
                    {badge.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-purple-600">
                        Game {idx + 1}
                      </span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase">
                        {g.tipe}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-slate-800 line-clamp-2 leading-tight mt-0.5">
                      {g.judul}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="p-3 mt-4 rounded-xl bg-purple-50/80 border border-purple-200 text-purple-900 text-xs leading-relaxed">
              <span className="font-bold block mb-1">🎮 Gamifikasi Otomatis:</span>
              Sistem menyarikan istilah, pasangan konsep, fakta benar/salah, alur kronologis, dan rantai sebab-akibat langsung dari {soalList.length} butir soal Anda.
            </div>
          </div>

          {/* Right: Selected Game Detail Preview */}
          <div className="md:col-span-8 p-6 overflow-y-auto space-y-5 bg-white">
            {currentGame && iconBadge && (
              <>
                <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider ${iconBadge.bgClass} border ${iconBadge.borderClass}`}>
                        Tipe: {currentGame.tipe.toUpperCase()}
                      </span>
                      {currentGame.waktuDetik && (
                        <span className="text-xs text-slate-500 font-bold flex items-center gap-1">
                          <Clock size={12} /> {currentGame.waktuDetik} Detik
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-black text-slate-900 leading-snug">
                      {currentGame.judul}
                    </h3>
                  </div>

                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${iconBadge.bgClass} border ${iconBadge.borderClass}`}>
                    {iconBadge.icon}
                  </div>
                </div>

                {/* Instruksi */}
                <div>
                  <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1">
                    Instruksi Permainan Siswa:
                  </div>
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-800 leading-relaxed font-medium">
                    {currentGame.instruksi}
                  </div>
                </div>

                {/* Specific Payload Preview per Game Type */}
                
                {/* 1. Jodoh */}
                {currentGame.tipe === 'jodoh' && currentGame.pasangan && (
                  <div>
                    <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Daftar Pasangan Konsep ({currentGame.pasangan.length} Pasangan):</span>
                      <span className="text-[10px] text-blue-600 font-bold">Kolom Kiri ↔ Kolom Kanan</span>
                    </div>
                    <div className="space-y-1.5">
                      {currentGame.pasangan.map((p, pIdx) => (
                        <div key={p.id || pIdx} className="p-2.5 rounded-xl bg-blue-50/50 border border-blue-100 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="font-bold text-blue-950 flex items-center gap-1.5">
                            <span className="w-5 h-5 rounded-full bg-blue-200 text-blue-800 text-[10px] flex items-center justify-center font-black">
                              {pIdx + 1}
                            </span>
                            <span>{p.kiri}</span>
                          </div>
                          <div className="text-slate-600 sm:border-l sm:border-blue-200 sm:pl-2">
                            {p.kanan}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 2. Klik */}
                {currentGame.tipe === 'klik' && currentGame.itemKlik && (
                  <div>
                    <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                      Kategori Target: <span className="text-purple-700 font-black">{currentGame.targetKategori || 'Karakteristik'}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentGame.itemKlik.map((item, itIdx) => (
                        <div
                          key={itIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-start justify-between gap-2 ${
                            item.benar
                              ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                              : 'bg-rose-50/50 border-rose-200 text-rose-950'
                          }`}
                        >
                          <span className="font-medium">{item.teks}</span>
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-black shrink-0 ${
                            item.benar ? 'bg-emerald-200 text-emerald-800' : 'bg-rose-200 text-rose-800'
                          }`}>
                            {item.benar ? 'Benar ✓' : 'Pengecoh ✕'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Urut */}
                {currentGame.tipe === 'urut' && currentGame.urutanBenar && (
                  <div>
                    <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                      Urutan Runtut yang Benar ({currentGame.urutanBenar.length} Tahap):
                    </div>
                    <div className="space-y-1.5">
                      {currentGame.urutanBenar.map((step, sIdx) => (
                        <div key={sIdx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs flex items-center gap-2 font-medium text-slate-800">
                          <span className="w-5 h-5 rounded-full bg-slate-900 text-white text-[10px] flex items-center justify-center font-black shrink-0">
                            {sIdx + 1}
                          </span>
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 4. Kumpul */}
                {currentGame.tipe === 'kumpul' && currentGame.itemKumpul && (
                  <div>
                    <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                      Koleksi Kata Kunci & Pengecoh:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {currentGame.itemKumpul.map((item, kIdx) => (
                        <div
                          key={kIdx}
                          className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                            item.benar
                              ? 'bg-amber-50/70 border-amber-200 text-amber-950'
                              : 'bg-slate-50 border-slate-200 text-slate-600'
                          }`}
                        >
                          <span className="font-bold">{item.teks}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-black shrink-0 ${
                            item.poin > 0 ? 'bg-amber-200 text-amber-900' : 'bg-rose-100 text-rose-800'
                          }`}>
                            {item.poin > 0 ? `+${item.poin}` : `${item.poin}`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Sambung */}
                {currentGame.tipe === 'sambung' && currentGame.rantaiLogika && (
                  <div>
                    <div className="text-xs font-extrabold uppercase text-slate-500 tracking-wider mb-1.5">
                      Rantai Logika Sebab ➔ Akibat:
                    </div>
                    <div className="space-y-2">
                      {currentGame.rantaiLogika.map((r, rIdx) => (
                        <div key={rIdx} className="p-2.5 rounded-xl bg-teal-50/60 border border-teal-200 text-xs grid grid-cols-1 sm:grid-cols-2 gap-2">
                          <div className="text-teal-950 font-semibold">
                            <span className="text-[10px] font-black uppercase text-teal-700 block mb-0.5">SEBAB:</span>
                            {r.sebab}
                          </div>
                          <div className="text-slate-700 sm:border-l sm:border-teal-200 sm:pl-2">
                            <span className="text-[10px] font-black uppercase text-indigo-700 block mb-0.5">AKIBAT:</span>
                            {r.akibat}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4 text-xs">
            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="applyGameMode"
                checked={replaceAll}
                onChange={() => setReplaceAll(true)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span>Gantikan Seluruh Game (5 Modul Rekomendasi)</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-700">
              <input
                type="radio"
                name="applyGameMode"
                checked={!replaceAll}
                onChange={() => setReplaceAll(false)}
                className="w-4 h-4 text-purple-600 focus:ring-purple-500"
              />
              <span>Tambahkan ke Game yang Ada</span>
            </label>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => {
                sound.playClick();
                onClose();
              }}
              className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold text-xs transition"
            >
              Batal
            </button>

            <button
              onClick={handleApply}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Sparkles size={15} />
              <span>Terapkan 5 Game ke MPI</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
